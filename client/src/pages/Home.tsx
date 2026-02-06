import { useDailyQuest } from "@/hooks/use-daily-quest";
import { useProgress } from "@/hooks/use-progress";
import { QuestCard } from "@/components/QuestCard";
import { StatsDrawer } from "@/components/StatsDrawer";
import { format } from "date-fns";
import { Sparkles, Flame, Package } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { playSound } from "@/lib/sound";

export default function Home() {
  const { quest } = useDailyQuest();
  const progressData = useProgress();
  const { isLoaded, isTodayCompleted, completeQuest, progress } = progressData;

  // Render minimal loading state
  if (!isLoaded || !quest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary"></div>
          <div className="h-4 w-32 bg-secondary rounded"></div>
        </div>
      </div>
    );
  }

  const todayDisplay = format(new Date(), 'EEEE, MMMM do');

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-background to-background dark:from-blue-950/20" />

      {/* Main Container */}
      <main className="relative z-10 container max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pt-4">
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              NanoQuest
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">{todayDisplay}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Quick Streak Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-bold border border-orange-100 dark:border-orange-900/30">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>{progress.currentStreak}</span>
            </div>

            {/* Packs */}
            <Button variant="ghost" size="icon" asChild aria-label="Packs">
              <Link href="/packs" onClick={() => playSound('click')}>
                <Package className="w-4 h-4" />
              </Link>
            </Button>
            
            {/* Drawer Trigger */}
            <StatsDrawer progressData={progressData} currentQuestText={quest.text} />
          </div>
        </header>

        {/* Core Interaction Area */}
        <section className="flex-1 flex flex-col justify-center pb-12">
          <QuestCard 
            quest={quest}
            isCompleted={isTodayCompleted}
            onComplete={completeQuest}
          />
          
          <p className="text-center text-muted-foreground/60 text-xs mt-8">
            One weird task per day.
          </p>
        </section>

      </main>
    </div>
  );
}
