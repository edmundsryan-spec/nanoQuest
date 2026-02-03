import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Lock, ArrowLeft, Sparkles } from "lucide-react";
import { hasAllPacks, hasPack, type PackId } from "@/lib/entitlements";

type Pack = {
  id: PackId;
  title: string;
  tagline: string;
  examples: string[];
};

const PACKS: Pack[] = [
  {
    id: "productivity",
    title: "Productivity Pack",
    tagline: "Small actions that clear friction and get you moving.",
    examples: [
      "Do a 5‑minute cleanup sprint.",
      "Close every unused tab.",
      "Write the next tiny step — then do it.",
    ],
  },
  {
    id: "social",
    title: "Social Anxiety Fears Me Pack",
    tagline: "Gentle social courage quests that build confidence.",
    examples: [
      "Say hello first.",
      "Ask one simple question.",
      "Give a sincere compliment.",
    ],
  },
  {
    id: "focus",
    title: "Ninja Focus Pack",
    tagline: "Micro‑challenges for attention, calm, and deep work.",
    examples: [
      "Phone face down for 20 minutes.",
      "One task. One tab.",
      "10 slow breaths before you start.",
    ],
  },
];

function PackStatus({ packId }: { packId: PackId }) {
  const owned = hasAllPacks() || hasPack(packId);

  if (owned) {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <BadgeCheck className="w-4 h-4" />
        <span>Unlocked</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
      <Lock className="w-4 h-4" />
      <span>Mobile app unlock</span>
    </div>
  );
}

export default function Packs() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-background to-background dark:from-blue-950/20" />

      <main className="relative z-10 container max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
        <header className="flex items-center justify-between mb-6 pt-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild aria-label="Back to home">
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>

            <div>
              <h1 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Packs
              </h1>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                Extra quest sets (unlocks in the mobile app)
              </p>
            </div>
          </div>
        </header>

        <section className="flex-1 space-y-4 pb-10">
          {PACKS.map((pack) => (
            <Card key={pack.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{pack.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {pack.tagline}
                    </CardDescription>
                  </div>
                  <PackStatus packId={pack.id} />
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Examples</div>
                <ul className="space-y-1 text-sm">
                  {pack.examples.map((ex) => (
                    <li key={ex} className="text-muted-foreground">
                      • {ex}
                    </li>
                  ))}
                </ul>

                {!hasAllPacks() && !hasPack(pack.id) && (
                  <div className="pt-3">
                    <div className="text-xs text-muted-foreground">
                      Want these? They’ll be available as a one‑time unlock in the Android/iOS app.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="pt-2 text-center text-muted-foreground/60 text-xs">
            NanoQuest is free on the web. Packs are reserved for the mobile app.
          </div>
        </section>
      </main>
    </div>
  );
}
