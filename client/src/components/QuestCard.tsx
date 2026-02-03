import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, LockKeyhole, Eye, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Quest } from '@/lib/quests';

interface QuestCardProps {
  quest: Quest;
  isCompleted: boolean;
  onComplete: (id: number) => void;
}

export function QuestCard({ quest, isCompleted, onComplete }: QuestCardProps) {
  const [isRevealed, setIsRevealed] = useState(isCompleted);

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
                  </motion.div>
                ) : (
                  <Button 
                    size="lg" 
                    onClick={() => onComplete(quest.id)}
                    className="rounded-full px-8 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                  >
                    I Did It
                  </Button>
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
