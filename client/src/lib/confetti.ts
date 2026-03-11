import confetti from "canvas-confetti";
import { Capacitor } from "@capacitor/core";

const isNative = Capacitor.isNativePlatform();

// Web: plain confetti
// Native: WebView-safe instance
const confettiFn = isNative
  ? confetti.create(undefined, { resize: true, useWorker: false })
  : confetti;

export function burstConfetti() {
  confettiFn({
    particleCount: 90,
    spread: 65,
    origin: { y: 0.6 },
    ticks: isNative ? 160 : undefined,
  });

  if (isNative && "reset" in confettiFn) {
    window.setTimeout(() => {
      try {
        // @ts-ignore
        confettiFn.reset?.();
      } catch {}
    }, 1200);
  }
}