import { useState, useEffect } from 'react';
import { z } from 'zod';
import { format, isToday, isYesterday, parseISO, differenceInCalendarDays } from 'date-fns';
import confetti from 'canvas-confetti';

// Zod Schema for LocalStorage
const historyItemSchema = z.object({
  date: z.string(),
  questId: z.number(),
  completed: z.boolean(),
});

const progressSchema = z.object({
  lastCompletedDate: z.string().nullable(),
  currentStreak: z.number().default(0),
  bestStreak: z.number().default(0),
  history: z.array(historyItemSchema).default([]),
  includeQuestInShare: z.boolean().default(false), // Settings preference
});

type ProgressState = z.infer<typeof progressSchema>;

const STORAGE_KEY = 'microquests-progress-v1';

export function useProgress() {
  const [state, setState] = useState<ProgressState>({
    lastCompletedDate: null,
    currentStreak: 0,
    bestStreak: 0,
    history: [],
    includeQuestInShare: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const result = progressSchema.safeParse(parsed);
        if (result.success) {
          // Check for broken streaks on load
          let newStreak = result.data.currentStreak;
          if (result.data.lastCompletedDate) {
            const lastDate = parseISO(result.data.lastCompletedDate);
            const today = new Date();
            const diff = differenceInCalendarDays(today, lastDate);
            
            // If more than 1 day passed since last completion (and it wasn't today), streak is broken
            if (diff > 1) {
              newStreak = 0;
            }
          }
          
          setState({ ...result.data, currentStreak: newStreak });
        } else {
          console.error("Invalid progress state in storage", result.error);
        }
      }
    } catch (e) {
      console.error("Failed to load progress", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const completeQuest = (questId: number) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    
    // Prevent double completion
    if (state.lastCompletedDate === todayStr) return;

    let newStreak = state.currentStreak;
    const isStreakContinuing = state.lastCompletedDate && isYesterday(parseISO(state.lastCompletedDate));

    if (isStreakContinuing) {
      newStreak += 1;
    } else {
      newStreak = 1; // Reset or start new
    }

    const newBestStreak = Math.max(newStreak, state.bestStreak);

    const newHistoryItem = {
      date: todayStr,
      questId,
      completed: true
    };

    setState(prev => ({
      ...prev,
      lastCompletedDate: todayStr,
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      history: [newHistoryItem, ...prev.history].slice(0, 30), // Keep last 30 days
    }));

    // Trigger celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899']
    });
  };

  const toggleShareSetting = () => {
    setState(prev => ({ ...prev, includeQuestInShare: !prev.includeQuestInShare }));
  };

  const isTodayCompleted = state.lastCompletedDate === format(new Date(), 'yyyy-MM-dd');

  return {
    progress: state,
    isLoaded,
    completeQuest,
    isTodayCompleted,
    toggleShareSetting
  };
}
