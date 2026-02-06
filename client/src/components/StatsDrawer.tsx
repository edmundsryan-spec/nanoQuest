import { useState } from "react";
import { format, parseISO } from "date-fns";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { History, Share2, Flame, Trophy, X, Settings2, Check } from "lucide-react";
import type { useProgress } from "@/hooks/use-progress";
import { QUESTS } from "@/lib/quests";
import { isSoundEnabled, playSound, setSoundEnabled } from "@/lib/sound";

interface StatsDrawerProps {
  progressData: ReturnType<typeof useProgress>;
  currentQuestText?: string;
}

export function StatsDrawer({ progressData, currentQuestText }: StatsDrawerProps) {
  const { progress, toggleShareSetting, journeyPulse } = progressData;
  const [isOpen, setIsOpen] = useState(false);
  const [soundOn, setSoundOnState] = useState(isSoundEnabled());

  const handleShare = async () => {
    playSound('click');
    let shareText = `NanoQuest streak: ${progress.currentStreak} days 🧠✨`;
    
    if (progress.includeQuestInShare && currentQuestText) {
      shareText += `\n\nToday's Quest: "${currentQuestText}"`;
    }
    
    if (progress.currentStreak >= 3) {
      shareText += `\n\nnanoquest.app`;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NanoQuest',
          text: shareText,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Copied to clipboard!');
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Your Journey"
          onClick={() => playSound('click')}
          className={
            [
              "rounded-full h-12 w-12 bg-secondary/50 hover:bg-secondary transition-colors",
              journeyPulse ? "ring-2 ring-primary/60 animate-pulse" : "",
            ].join(" ")
          }
        >
          <History className="h-5 w-5 text-foreground/80" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto rounded-t-[2rem]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="border-b pb-6 mb-6">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-2xl font-display font-bold">Your Journey</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-8 space-y-8 overflow-y-auto max-h-[60vh]">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 dark:bg-orange-950/20 p-5 rounded-2xl border border-orange-100 dark:border-orange-900/50 flex flex-col items-center text-center">
                <Flame className="w-8 h-8 text-orange-500 mb-2" />
                <div className="text-3xl font-bold text-orange-700 dark:text-orange-400 font-display">
                  {progress.currentStreak}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-orange-600/60 dark:text-orange-400/60">
                  Current Streak
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-950/20 p-5 rounded-2xl border border-purple-100 dark:border-purple-900/50 flex flex-col items-center text-center">
                <Trophy className="w-8 h-8 text-purple-500 mb-2" />
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-400 font-display">
                  {progress.bestStreak}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-purple-600/60 dark:text-purple-400/60">
                  Best Streak
                </div>
              </div>
            </div>

            {/* Recent History */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Last 7 Days
              </h4>
              <div className="space-y-3">
                {progress.history.slice(0, 7).map((item, i) => {
                  const quest = QUESTS.find(q => q.id === item.questId);
                  return (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground">
                          {format(parseISO(item.date), 'EEE, MMM d')}
                        </span>
                        <span className="text-sm font-medium text-foreground line-clamp-1">
                          {quest ? quest.text : 'Unknown Quest'}
                        </span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                    </div>
                  );
                })}
                {progress.history.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm italic">
                    No history yet. Start your first quest!
                  </div>
                )}
              </div>
            </div>

            {/* Share Settings */}
            <div className="bg-secondary/20 rounded-2xl p-4 border border-border/50">
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-4">
                <Settings2 className="w-4 h-4" /> Sharing Preferences
              </h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="share-text" className="text-sm text-muted-foreground cursor-pointer">
                  Include quest text when sharing
                </Label>
                <Switch 
                  id="share-text" 
                  checked={progress.includeQuestInShare}
                  onCheckedChange={() => {
                    playSound("click");
                    toggleShareSetting();
                  }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Label htmlFor="sound-effects" className="text-sm text-muted-foreground cursor-pointer">
                  Sound effects
                </Label>
                <Switch
                  id="sound-effects"
                  checked={soundOn}
                  onCheckedChange={(value) => {
                    playSound("click");
                    setSoundEnabled(!!value);
                    setSoundOnState(!!value);
                  }}
                />
              </div>
            </div>

            <Button onClick={handleShare} className="w-full rounded-xl py-6 text-lg font-semibold gap-2">
              <Share2 className="w-5 h-5" />
              Share My Streak
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
