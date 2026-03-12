export type Entitlements = {
  socialAnxietyFearsMe: boolean;
  ninjaFocus: boolean;
  letHimCook: boolean;
  dailyReminders: boolean;
  unlockAll: boolean;
};

const STORAGE_KEY = "nanoquest_entitlements";

const defaultEntitlements: Entitlements = {
  socialAnxietyFearsMe: false,
  ninjaFocus: false,
  letHimCook: false,
  dailyReminders: false,
  unlockAll: false,
};

export function getEntitlements(): Entitlements {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultEntitlements;

    const parsed = JSON.parse(raw);

    return {
      ...defaultEntitlements,
      ...parsed,
    };
  } catch {
    return defaultEntitlements;
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

export function hasPack(
  entitlements: Entitlements,
  pack: "socialAnxietyFearsMe" | "ninjaFocus" | "letHimCook"
) {
  return entitlements.unlockAll || entitlements[pack];
}

export function hasDailyReminders(entitlements: Entitlements) {
  return entitlements.unlockAll || entitlements.dailyReminders;
}