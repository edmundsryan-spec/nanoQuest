import { useMemo } from 'react';
import { format } from 'date-fns';
import { QUESTS, getCategoryForDay, type Quest } from '@/lib/quests';

export function useDailyQuest() {
  const today = new Date();
  const dateStr = format(today, 'yyyy-MM-dd');
  const dayIndex = today.getDay(); // 0 = Sun, 1 = Mon...

  const dailyQuest = useMemo(() => {
    // 1. Filter quests by today's allowed categories
    const allowedCategories = getCategoryForDay(dayIndex);
    const candidateQuests = QUESTS.filter(q => allowedCategories.includes(q.category));
    
    // Fallback if no quests found (shouldn't happen with full bank)
    const pool = candidateQuests.length > 0 ? candidateQuests : QUESTS;

    // 2. Simple seeded random using the date string
    // This ensures every user gets the SAME quest on the SAME day
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    const index = Math.abs(hash) % pool.length;
    return pool[index];
  }, [dateStr, dayIndex]);

  return { quest: dailyQuest, dateStr };
}
