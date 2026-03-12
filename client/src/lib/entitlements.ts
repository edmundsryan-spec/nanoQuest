export type PackId = "productivity" | "social" | "focus";

export type Entitlements = {
  productivity: boolean;
  social: boolean;
  focus: boolean;
  dailyReminders: boolean;
  allPacks: boolean;
};

const STORAGE_KEY = "nanoquest_entitlements";

const DEFAULT_ENTITLEMENTS: Entitlements = {
  productivity: false,
  social: false,
  focus: false,
  dailyReminders: false,
  allPacks: false,
};

export function getEntitlements(): Entitlements {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ENTITLEMENTS;

    const parsed = JSON.parse(raw);

    return {
      ...DEFAULT_ENTITLEMENTS,
      ...parsed,
    };
  } catch {
    return DEFAULT_ENTITLEMENTS;
  }
}

export function setEntitlements(next: Partial<Entitlements>) {
  const current = getEntitlements();
  const merged = { ...current, ...next };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }

  return merged;
}

export function resetEntitlements() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function hasAllPacks(): boolean {
  const entitlements = getEntitlements();
  return entitlements.allPacks;
}

export function hasPack(packId: PackId): boolean {
  const entitlements = getEntitlements();
  return entitlements.allPacks || entitlements[packId];
}

export function hasDailyReminders(): boolean {
  const entitlements = getEntitlements();
  return entitlements.allPacks || entitlements.dailyReminders;
}