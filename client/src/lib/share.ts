import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";

export async function shareText(text: string, url?: string) {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    await Share.share({
      text,
      url,
      dialogTitle: "Share your streak",
    });
    return;
  }

  if (navigator.share) {
    await navigator.share({
      text,
      url,
    });
    return;
  }

  const fallback = url ? `${text}\n${url}` : text;
  await navigator.clipboard.writeText(fallback);
}