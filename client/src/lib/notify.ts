import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

const REMINDER_ID = 1001;

export async function requestReminderPermission() {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    const perm = await LocalNotifications.requestPermissions();
    return perm.display === "granted";
  }

  if ("Notification" in window) {
    const result = await Notification.requestPermission();
    return result === "granted";
  }

  return false;
}

export async function scheduleReminder(hours: number) {
  const ms = Math.max(1, Math.min(6, hours)) * 60 * 60 * 1000;
  const target = new Date(Date.now() + ms);
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });

    await LocalNotifications.schedule({
      notifications: [
        {
          id: REMINDER_ID,
          title: "NanoQuest",
          body: "Come back and mark today’s quest completed.",
          schedule: { at: target },
        },
      ],
    });

    return target.getTime();
  }

  // Web fallback
  window.setTimeout(() => {
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("NanoQuest", {
          body: "Come back and mark today’s quest completed.",
        });
      }
    } catch {}
  }, ms);

  return target.getTime();
}

export async function clearReminder() {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
    } catch {}
  }
}