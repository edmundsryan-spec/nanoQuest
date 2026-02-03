export type PackId = "productivity" | "social" | "focus";

/**
 * Web build entitlements.
 *
 * The web app is intended to stay free and does not sell packs.
 * When we wrap for Android/iOS, we can replace this logic to read
 * store ownership (Google Play Billing / Apple IAP) and enable packs.
 */
export function hasPack(_pack: PackId): boolean {
  return false;
}

export function hasAllPacks(): boolean {
  return false;
}

export function canPurchaseInThisBuild(): boolean {
  return false;
}
