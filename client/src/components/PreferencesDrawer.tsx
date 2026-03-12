import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Settings,
  X,
  Bell,
  Volume2,
  Lock,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { isSoundEnabled, playSound, setSoundEnabled } from "@/lib/sound";

interface PreferencesDrawerProps {
  hasDailyReminders?: boolean;
  onUpgradeDailyReminders?: () => void;
  onRestorePurchases?: () => void;
}

const DAILY_REMINDER_ENABLED_KEY = "nanoquest_daily_reminder_enabled";
const DAILY_REMINDER_TIME_KEY = "nanoquest_daily_reminder_time";

export function PreferencesDrawer({
  hasDailyReminders = false,
  onUpgradeDailyReminders,
  onRestorePurchases,
}: PreferencesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [soundOn, setSoundOnState] = useState(isSoundEnabled());
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [dailyReminderTime, setDailyReminderTime] = useState("09:00");

  useEffect(() => {
    try {
      const storedEnabled = localStorage.getItem(DAILY_REMINDER_ENABLED_KEY);
      const storedTime = localStorage.getItem(DAILY_REMINDER_TIME_KEY);

      if (storedEnabled !== null) {
        setDailyReminderEnabled(storedEnabled === "1");
      }

      if (storedTime) {
        setDailyReminderTime(storedTime);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSoundToggle = (value: boolean) => {
    playSound("click");
    setSoundEnabled(value);
    setSoundOnState(value);
  };

  const handleDailyReminderToggle = (value: boolean) => {
    playSound("click");

    if (!hasDailyReminders) {
      onUpgradeDailyReminders?.();
      return;
    }

    setDailyReminderEnabled(value);

    try {
      localStorage.setItem(DAILY_REMINDER_ENABLED_KEY, value ? "1" : "0");
    } catch {
      // ignore
    }
  };

  const handleReminderTimeChange = (value: string) => {
    setDailyReminderTime(value);

    try {
      localStorage.setItem(DAILY_REMINDER_TIME_KEY, value);
    } catch {
      // ignore
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Preferences"
          onClick={() => playSound("click")}
          className="rounded-full h-12 w-12 bg-secondary/50 hover:bg-secondary transition-colors"
        >
          <Settings className="h-5 w-5 text-foreground/80" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-w-md mx-auto rounded-t-[2rem]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="border-b pb-6 mb-6">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-2xl font-display font-bold">
                Preferences
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-8 space-y-6 overflow-y-auto max-h-[60vh]">
            {/* Sound */}
            <div className="bg-secondary/20 rounded-2xl p-4 border border-border/50">
              <div className="flex items-start gap-3 mb-4">
                <div className="rounded-full bg-background border border-border p-2">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Sound Effects</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gentle clicks and completion chimes.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="sound-effects"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Enable sound effects
                </Label>
                <Switch
                  id="sound-effects"
                  checked={soundOn}
                  onCheckedChange={handleSoundToggle}
                />
              </div>
            </div>

            {/* Daily Reminders */}
            <div className="bg-secondary/20 rounded-2xl p-4 border border-border/50">
              <div className="flex items-start gap-3 mb-4">
                <div className="rounded-full bg-background border border-border p-2">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    Daily Reminders
                    {!hasDailyReminders && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get one daily nudge at a custom time.
                  </p>
                </div>
              </div>

              {hasDailyReminders ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="daily-reminders"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Enable daily reminders
                    </Label>
                    <Switch
                      id="daily-reminders"
                      checked={dailyReminderEnabled}
                      onCheckedChange={handleDailyReminderToggle}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="daily-reminder-time"
                      className="text-sm text-muted-foreground"
                    >
                      Reminder time
                    </Label>
                    <input
                      id="daily-reminder-time"
                      type="time"
                      value={dailyReminderTime}
                      onChange={(e) => handleReminderTimeChange(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      disabled={!dailyReminderEnabled}
                    />
                    <p className="text-xs text-muted-foreground">
                      NanoQuest will send one reminder each day at this time.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-dashed border-border/70 bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">
                      Unlock Daily Reminders to schedule a custom daily notification.
                    </p>
                  </div>

                  <Button
                    className="w-full rounded-xl gap-2"
                    onClick={() => {
                      playSound("click");
                      onUpgradeDailyReminders?.();
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Unlock Daily Reminders
                  </Button>
                </div>
              )}
            </div>

            {/* Restore Purchases */}
            <div className="bg-secondary/20 rounded-2xl p-4 border border-border/50">
              <div className="flex items-start gap-3 mb-4">
                <div className="rounded-full bg-background border border-border p-2">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Restore Purchases</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Re-check your existing purchases on this device.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => {
                  playSound("click");
                  onRestorePurchases?.();
                }}
              >
                Restore Purchases
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}