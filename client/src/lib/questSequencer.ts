import { format } from "date-fns";

import { QUESTS, getPrimaryCategoryForDay, type Quest } from "@/lib/quests";
import { hasAllPacks, hasPack, type PackId } from "@/lib/entitlements";

type Source = "core" | "pack";

const LS = {
  INSTALL_DATE: "nq_install_date",
  INSTALL_ID: "nq_install_id",
  TODAY_DATE: "nq_today_date",
  TODAY_QUEST_ID: "nq_today_quest_id",
  TODAY_SOURCE: "nq_today_source",
  PACK_RR: "nq_pack_rr",
} as const;

const SCHEDULE: Source[] = ["core", "core", "pack"]; // pack every 3rd day

function getOrCreateInstallId(): string {
  const existing = localStorage.getItem(LS.INSTALL_ID);
  if (existing) return existing;

  const c = typeof globalThis !== "undefined" ? (globalThis as any).crypto : undefined;
  const id = (c && typeof c.randomUUID === "function")
    ? c.randomUUID()
    : `nq_${Math.random().toString(16).slice(2)}_${Date.now()}`;

  localStorage.setItem(LS.INSTALL_ID, id);
  return id;
}

function getOrCreateInstallDate(todayStr: string): string {
  const existing = localStorage.getItem(LS.INSTALL_DATE);
  if (existing) return existing;
  localStorage.setItem(LS.INSTALL_DATE, todayStr);
  return todayStr;
}

function toLocalMidnight(dateStr: string): Date {
  // dateStr is YYYY-MM-DD
  const [y, m, d] = dateStr.split("-").map((v) => parseInt(v, 10));
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
}

function daysBetweenLocal(aStr: string, bStr: string): number {
  const a = toLocalMidnight(aStr);
  const b = toLocalMidnight(bStr);
  const ms = b.getTime() - a.getTime();
  return Math.max(0, Math.floor(ms / (24 * 60 * 60 * 1000)));
}

function hash32(input: string): number {
  // Simple deterministic 32-bit hash.
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function getInt(key: string, fallback = 0): number {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

function setInt(key: string, value: number) {
  localStorage.setItem(key, String(value));
}

function ptrKey(stream: string, category: Quest["category"]): string {
  return `nq_ptr_${stream}_${category}`;
}

function offsetFor(streamKey: string, listLength: number): number {
  if (listLength <= 0) return 0;
  const installId = getOrCreateInstallId();
  const h = hash32(`${installId}::${streamKey}`);
  return Math.abs(h) % listLength;
}

function getOwnedPacks(): PackId[] {
  if (hasAllPacks()) return ["productivity", "social", "focus"];
  const owned: PackId[] = [];
  ( ["productivity", "social", "focus"] as const ).forEach((p) => {
    if (hasPack(p)) owned.push(p);
  });
  return owned;
}

function pickNextPackId(owned: PackId[]): PackId {
  const rr = getInt(LS.PACK_RR, 0);
  const pick = owned[rr % owned.length] ?? owned[0];
  setInt(LS.PACK_RR, rr + 1);
  return pick ?? "productivity";
}

function questsFor(pack: Quest["pack"], category: Quest["category"]): Quest[] {
  return QUESTS.filter((q) => q.pack === pack && q.category === category);
}

function questsForAnyCategory(pack: Quest["pack"], categories: Quest["category"][]): Quest[] {
  return QUESTS.filter((q) => q.pack === pack && categories.includes(q.category));
}

function selectFromList(list: Quest[], streamKey: string, category: Quest["category"]): Quest | null {
  if (list.length === 0) return null;
  const pKey = ptrKey(streamKey, category);
  const ptr = getInt(pKey, 0);
  const off = offsetFor(`${streamKey}:${category}`, list.length);
  const idx = (off + ptr) % list.length;
  const quest = list[idx] ?? list[0];
  setInt(pKey, ptr + 1);
  return quest ?? null;
}

/**
 * Returns today's quest (stable for the day) using:
 * - sequential progression (per stream/category)
 * - per-user randomized starting offset
 * - pack interleaving (every 3rd day), based on owned packs
 */
export function getTodaysQuest(now = new Date()): { quest: Quest; dateStr: string; source: Source } {
  const dateStr = format(now, "yyyy-MM-dd");
  const installDate = getOrCreateInstallDate(dateStr);

  // If we already assigned a quest for today, return it.
  const lastDate = localStorage.getItem(LS.TODAY_DATE);
  const lastQuestId = localStorage.getItem(LS.TODAY_QUEST_ID);
  const lastSource = (localStorage.getItem(LS.TODAY_SOURCE) as Source | null) ?? null;
  if (lastDate === dateStr && lastQuestId) {
    const idNum = parseInt(lastQuestId, 10);
    const existing = QUESTS.find((q) => q.id === idNum);
    if (existing) {
      return { quest: existing, dateStr, source: lastSource ?? "core" };
    }
  }

  const dayOfWeek = now.getDay();
  const primaryCategory = getPrimaryCategoryForDay(dayOfWeek);
  const allowedCategories: Quest["category"][] = dayOfWeek >= 1 && dayOfWeek <= 4
    ? (dayOfWeek % 2 === 1 ? ["Social"] : ["Focus"]) // Mon/Wed vs Tue/Thu
    : [primaryCategory];

  const dayIndex = daysBetweenLocal(installDate, dateStr);
  let source: Source = SCHEDULE[dayIndex % SCHEDULE.length] ?? "core";

  const ownedPacks = getOwnedPacks();
  if (source === "pack" && ownedPacks.length === 0) {
    source = "core";
  }

  // Core selection
  const coreList = questsForAnyCategory("core", allowedCategories);
  let picked: Quest | null = null;

  if (source === "core") {
    picked = selectFromList(coreList, "core", allowedCategories[0]);
  } else {
    const packId = pickNextPackId(ownedPacks);
    const packKey: Quest["pack"] = packId === "productivity" ? "productivity" : packId;

    // Prefer quests that match today's category.
    const packList = questsForAnyCategory(packKey, allowedCategories);
    picked = selectFromList(packList, `pack_${packId}`, allowedCategories[0]);

    // If a pack doesn't have that category, fall back to core.
    if (!picked) {
      picked = selectFromList(coreList, "core", allowedCategories[0]);
      source = "core";
    }
  }

  // Absolute fallback: any core quest.
  if (!picked) {
    const anyCore = QUESTS.filter((q) => q.pack === "core");
    picked = anyCore[0] ?? QUESTS[0];
    source = "core";
  }

  localStorage.setItem(LS.TODAY_DATE, dateStr);
  localStorage.setItem(LS.TODAY_QUEST_ID, String(picked.id));
  localStorage.setItem(LS.TODAY_SOURCE, source);

  return { quest: picked, dateStr, source };
}
