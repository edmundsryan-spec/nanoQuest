// Simple UI sound effects helper.
//
// Expected files (place in client/public/sfx/):
//  - click.mp3
//  - complete.mp3
//
// This is intentionally tiny and "best effort" for the web.
// Browsers may block audio until the user interacts with the page.

export type SoundName = 'click' | 'complete';

const STORAGE_KEY = 'nanoquest_sound_enabled';

let enabled = true;
let initialized = false;

const audioMap: Partial<Record<SoundName, HTMLAudioElement>> = {};

function initIfNeeded() {
  if (initialized) return;
  initialized = true;

  // Load persisted setting.
  try {
    enabled = localStorage.getItem(STORAGE_KEY) !== '0';
  } catch {
    enabled = true;
  }

  // Create audio elements lazily, but configure volumes up front.
  audioMap.click = new Audio('/sfx/click.mp3');
  audioMap.complete = new Audio('/sfx/complete.mp3');

  // Soft volumes by default.
  audioMap.click.volume = 0.25;
  audioMap.complete.volume = 0.35;

  audioMap.click.preload = 'auto';
  audioMap.complete.preload = 'auto';
}

export function isSoundEnabled(): boolean {
  initIfNeeded();
  return enabled;
}

export function setSoundEnabled(value: boolean) {
  initIfNeeded();
  enabled = value;
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  } catch {
    // ignore
  }
}

export function playSound(name: SoundName) {
  initIfNeeded();
  if (!enabled) return;

  const audio = audioMap[name];
  if (!audio) return;

  try {
    // Allow rapid re-triggers.
    audio.currentTime = 0;
    // Best effort: browsers may block until the user interacts.
    void audio.play();
  } catch {
    // ignore
  }
}
