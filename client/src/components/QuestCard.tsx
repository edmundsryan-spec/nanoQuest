import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, LockKeyhole, Eye, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import type { Quest } from '@/lib/quests';

interface QuestCardProps {
  quest: Quest;
  isCompleted: boolean;
  onComplete: (id: number) => void;
}

export function QuestCard({ quest, isCompleted, onComplete }: QuestCardProps) {
  const [isRevealed, setIsRevealed] = useState(isCompleted);
  const [showRemindOptions, setShowRemindOptions] = useState(false);
  const [reminderAt, setReminderAt] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const todayKey = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const reminderStorageKey = 'nanoquest_reminder_at';
  const reminderDateKey = 'nanoquest_reminder_date';

  const clearReminder = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    localStorage.removeItem(reminderStorageKey);
    localStorage.removeItem(reminderDateKey);
    setReminderAt(null);
  };

  const scheduleReminder = async (hours: number) => {
    const ms = Math.max(1, Math.min(6, hours)) * 60 * 60 * 1000;
    const target = Date.now() + ms;

    // Persist so refreshes keep the reminder.
    localStorage.setItem(reminderStorageKey, String(target));
    localStorage.setItem(reminderDateKey, todayKey);
    setReminderAt(target);

    // Clear any previous timeout.
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      toast({
        title: 'Reminder',
        description: "Come back and mark today's quest completed.",
      });

      // Best-effort browser notification (works only if the browser allows it).
      try {
        if ('Notification' in window && Notification.permission === 'granted') {
          // eslint-disable-next-line no-new
          new Notification('NanoQuest', { body: "Your quest is ready to be completed." });
        }
      } catch {
        // Ignore.
      }

      clearReminder();
    }, ms);

    // Ask for notification permission only when user explicitly schedules.
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch {
        // Ignore.
      }
    }

    toast({
      title: 'Reminder set',
      description: `We'll nudge you in ${hours} hour${hours === 1 ? '' : 's'}.`,
    });
  };

  useEffect(() => {
    // Load any existing reminder.
    const storedDate = localStorage.getItem(reminderDateKey);
    const storedAt = localStorage.getItem(reminderStorageKey);
    if (!storedAt) return;

    // If reminder is for a different day, clear it.
    if (storedDate !== todayKey) {
      clearReminder();
      return;
    }

    const at = Number(storedAt);
    if (!Number.isFinite(at) || at <= Date.now()) {
      clearReminder();
      return;
    }

    setReminderAt(at);
    const ms = at - Date.now();
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      toast({
        title: 'Reminder',
        description: "Come back and mark today's quest completed.",
      });
      try {
        if ('Notification' in window && Notification.permission === 'granted') {
          // eslint-disable-next-line no-new
          new Notification('NanoQuest', { body: "Your quest is ready to be completed." });
        }
      } catch {
        // Ignore.
      }
      clearReminder();
    }, ms);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayKey]);

  const handleReveal = () => {
    if (!isRevealed) setIsRevealed(true);
  };

  return (
    <div className="relative w-full max-w-md mx-auto perspective-1000">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "relative overflow-hidden rounded-3xl bg-card shadow-xl border border-border/50 p-8 min-h-[400px] flex flex-col items-center justify-center text-center transition-all duration-500",
          isCompleted ? "border-primary/20 shadow-primary/10" : "shadow-black/5"
        )}
      >
        {/* Category Badge */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-widest">
          {quest.category}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                className="cursor-pointer group flex flex-col items-center gap-4"
                onClick={handleReveal}
              >
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <LockKeyhole className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-display font-medium text-foreground">
                  Today's Quest
                </h3>
                <p className="text-muted-foreground text-sm">Tap to reveal your challenge</p>
                <Button variant="ghost" className="mt-4 rounded-full" size="sm">
                  <Eye className="w-4 h-4 mr-2" /> Reveal
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full flex flex-col items-center gap-8"
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight text-foreground text-balance">
                  {quest.text}
                </h2>
                
                {isCompleted ? (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center gap-2 text-primary"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-8 h-8 text-primary" strokeWidth={3} />
                    </div>
                    <span className="font-semibold tracking-wide uppercase text-sm">Completed</span>
                    <p className="text-xs text-muted-foreground mt-2">
                      Check back tomorrow for your next quest!
                    </p>
                  </motion.div>
                ) : (
                  <div className="w-full flex flex-col items-center gap-3">
                    {/* Remind Me */}
                    <div className="w-full flex flex-col items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowRemindOptions((v) => !v)}
                        className="rounded-full px-6"
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        Remind me
                      </Button>

                      <AnimatePresence>
                        {showRemindOptions && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="flex flex-wrap justify-center gap-2"
                          >
                            {[1, 2, 3, 4, 5, 6].map((h) => (
                              <Button
                                key={h}
                                type="button"
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                onClick={() => {
                                  setShowRemindOptions(false);
                                  scheduleReminder(h);
                                }}
                              >
                                {h}h
                              </Button>
                            ))}
                            {reminderAt && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="rounded-full"
                                onClick={() => {
                                  clearReminder();
                                  toast({ title: 'Reminder cleared' });
                                }}
                              >
                                Clear
                              </Button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {reminderAt && (
                        <p className="text-xs text-muted-foreground">
                          Reminder set in ~{Math.max(1, Math.round((reminderAt - Date.now()) / 60000))} min
                        </p>
                      )}
                    </div>

                    {/* Complete */}
                    <Button 
                      size="lg" 
                      onClick={() => {
                        clearReminder();
                        onComplete(quest.id);
                      }}
                      className="rounded-full px-8 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                    >
                      I Did It
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      </motion.div>
    </div>
  );
}
