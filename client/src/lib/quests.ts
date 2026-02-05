export interface Quest {
  id: number;
  text: string;
  category: "Social" | "Focus" | "Playful" | "Weirdness" | "Reflection";
  /** Which quest set this belongs to. Core is free on web; packs unlock in mobile builds. */
  pack: "core" | "productivity" | "social" | "focus";
}

export const QUESTS: Quest[] = [
  // Social Courage
  { id: 1, text: "Compliment a stranger.", category: "Social", pack: "core" },
  { id: 2, text: "Say hello first.", category: "Social", pack: "core" },
  { id: 3, text: "Thank someone by name.", category: "Social", pack: "core" },
  { id: 4, text: "Ask someone how their day is going — and wait for the answer.", category: "Social", pack: "core" },
  { id: 5, text: "Hold eye contact for one full sentence.", category: "Social", pack: "core" },
  { id: 6, text: "Start a conversation you’d normally avoid.", category: "Social", pack: "core" },
  { id: 7, text: "Message someone you haven’t talked to in a while.", category: "Social", pack: "core" },
  { id: 8, text: "Tell someone you appreciate them.", category: "Social", pack: "core" },
  { id: 9, text: "Ask a genuine follow-up question.", category: "Social", pack: "core" },
  { id: 10, text: "Introduce yourself to someone new.", category: "Social", pack: "core" },
  
  // Focus & Digital Discipline
  { id: 101, text: "Don’t check your phone for 10 minutes.", category: "Focus", pack: "core" },
  { id: 102, text: "Put your phone in another room for 15 minutes.", category: "Focus", pack: "core" },
  { id: 103, text: "Do one task without switching tabs.", category: "Focus", pack: "core" },
  { id: 104, text: "Sit in silence for 2 minutes.", category: "Focus", pack: "core" },
  { id: 105, text: "Eat one meal without screens.", category: "Focus", pack: "core" },
  { id: 106, text: "Finish a small task you’ve been avoiding.", category: "Focus", pack: "core" },
  { id: 107, text: "Take a slow walk without headphones.", category: "Focus", pack: "core" },
  { id: 108, text: "Breathe deeply for 10 slow breaths.", category: "Focus", pack: "core" },
  { id: 109, text: "Clear one digital notification you’ve been ignoring.", category: "Focus", pack: "core" },
  { id: 110, text: "Work for 10 minutes without interruption.", category: "Focus", pack: "core" },
  
  // Light Weirdness
  { id: 201, text: "Take a different route today.", category: "Weirdness", pack: "core" },
  { id: 202, text: "Sit in a different spot than usual.", category: "Weirdness", pack: "core" },
  { id: 203, text: "Write something by hand.", category: "Weirdness", pack: "core" },
  { id: 204, text: "Change one tiny routine.", category: "Weirdness", pack: "core" },
  { id: 205, text: "Stand instead of sitting for a few minutes.", category: "Weirdness", pack: "core" },
  { id: 206, text: "Eat something without multitasking.", category: "Weirdness", pack: "core" },
  { id: 207, text: "Listen to a song all the way through.", category: "Weirdness", pack: "core" },
  { id: 208, text: "Stretch for 60 seconds.", category: "Weirdness", pack: "core" },
  
  // Reflection Lite
  { id: 301, text: "Notice what you’re avoiding today.", category: "Reflection", pack: "core" },
  { id: 302, text: "Name one thing you’re grateful for.", category: "Reflection", pack: "core" },
  { id: 303, text: "Think of one recent win, no matter how small.", category: "Reflection", pack: "core" },
  { id: 304, text: "Ask yourself: “What’s the simplest next step?”", category: "Reflection", pack: "core" },
  { id: 305, text: "Forgive yourself for one tiny thing.", category: "Reflection", pack: "core" },
  
  // Playful
  { id: 401, text: "Wave first.", category: "Playful", pack: "core" },
  { id: 402, text: "Say “good morning” to someone unexpected.", category: "Playful", pack: "core" },
  { id: 403, text: "Make someone laugh (even quietly).", category: "Playful", pack: "core" },
  { id: 404, text: "React instead of scrolling.", category: "Playful", pack: "core" },
  { id: 405, text: "Be extra polite on purpose.", category: "Playful", pack: "core" },
  { id: 406, text: "Say “thank you” twice today.", category: "Playful", pack: "core" },

  // --- Pack samples (locked on web; included so sequencing logic is ready) ---
  // Let Him Cook (productivity)
  { id: 1001, text: "Do a 5‑minute cleanup sprint.", category: "Focus", pack: "productivity" },
  { id: 1002, text: "Write the next tiny step — then do it.", category: "Focus", pack: "productivity" },
  { id: 1003, text: "Ship a rough version of something.", category: "Focus", pack: "productivity" },
  { id: 1004, text: "Send the message you’re postponing.", category: "Social", pack: "productivity" },
  // Social Anxiety Fears Me
  { id: 1101, text: "Ask one simple question.", category: "Social", pack: "social" },
  { id: 1102, text: "Give a sincere compliment.", category: "Social", pack: "social" },
  { id: 1103, text: "Start with “Hey — quick question…”", category: "Social", pack: "social" },
  // Ninja Focus
  { id: 1201, text: "One task. One tab.", category: "Focus", pack: "focus" },
  { id: 1202, text: "Phone face down for 20 minutes.", category: "Focus", pack: "focus" },
  { id: 1203, text: "10 slow breaths before you start.", category: "Focus", pack: "focus" },
];

export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to get category for day
// Mon-Thu: Social/Focus (1,2,3,4)
// Fri: Playful (5)
// Sat: Weirdness (6)
// Sun: Reflection (0)
export function getCategoryForDay(dayIndex: number): string[] {
  switch (dayIndex) {
    case 0: return ["Reflection"];
    case 5: return ["Playful"];
    case 6: return ["Weirdness"];
    default: return ["Social", "Focus"];
  }
}

/**
 * Primary category for sequencing.
 * Mon/Wed -> Social, Tue/Thu -> Focus.
 */
export function getPrimaryCategoryForDay(dayIndex: number): Quest["category"] {
  if (dayIndex === 0) return "Reflection";
  if (dayIndex === 5) return "Playful";
  if (dayIndex === 6) return "Weirdness";
  // Monday(1), Wednesday(3) => Social; Tuesday(2), Thursday(4) => Focus
  return dayIndex % 2 === 1 ? "Social" : "Focus";
}

