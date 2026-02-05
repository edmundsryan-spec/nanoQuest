import { useMemo } from "react";
import { getTodaysQuest } from "@/lib/questSequencer";

export function useDailyQuest() {
  // Recompute when the local date changes (e.g., app left open past midnight).
  const dayKey = new Date().toDateString();
  const { quest, dateStr } = useMemo(() => getTodaysQuest(new Date()), [dayKey]);
  return { quest, dateStr };
}
