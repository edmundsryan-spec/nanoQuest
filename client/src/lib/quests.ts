export interface Quest {
  id: number;
  text: string;
  category: "Social" | "Focus" | "Playful" | "Weirdness" | "Reflection";
}

export const QUESTS: Quest[] = [
  // Social Courage
  { id: 1, text: "Compliment a stranger.", category: "Social" },
  { id: 2, text: "Say hello first.", category: "Social" },
  { id: 3, text: "Thank someone by name.", category: "Social" },
  { id: 4, text: "Ask someone how their day is going — and wait for the answer.", category: "Social" },
  { id: 5, text: "Hold eye contact for one full sentence.", category: "Social" },
  { id: 6, text: "Start a conversation you’d normally avoid.", category: "Social" },
  { id: 7, text: "Message someone you haven’t talked to in a while.", category: "Social" },
  { id: 8, text: "Tell someone you appreciate them.", category: "Social" },
  { id: 9, text: "Ask a genuine follow-up question.", category: "Social" },
  { id: 10, text: "Introduce yourself to someone new.", category: "Social" },
  
  // Focus & Digital Discipline
  { id: 101, text: "Don’t check your phone for 10 minutes.", category: "Focus" },
  { id: 102, text: "Put your phone in another room for 15 minutes.", category: "Focus" },
  { id: 103, text: "Do one task without switching tabs.", category: "Focus" },
  { id: 104, text: "Sit in silence for 2 minutes.", category: "Focus" },
  { id: 105, text: "Eat one meal without screens.", category: "Focus" },
  { id: 106, text: "Finish a small task you’ve been avoiding.", category: "Focus" },
  { id: 107, text: "Take a slow walk without headphones.", category: "Focus" },
  { id: 108, text: "Breathe deeply for 10 slow breaths.", category: "Focus" },
  { id: 109, text: "Clear one digital notification you’ve been ignoring.", category: "Focus" },
  { id: 110, text: "Work for 10 minutes without interruption.", category: "Focus" },
  
  // Light Weirdness
  { id: 201, text: "Take a different route today.", category: "Weirdness" },
  { id: 202, text: "Sit in a different spot than usual.", category: "Weirdness" },
  { id: 203, text: "Write something by hand.", category: "Weirdness" },
  { id: 204, text: "Change one tiny routine.", category: "Weirdness" },
  { id: 205, text: "Stand instead of sitting for a few minutes.", category: "Weirdness" },
  { id: 206, text: "Eat something without multitasking.", category: "Weirdness" },
  { id: 207, text: "Listen to a song all the way through.", category: "Weirdness" },
  { id: 208, text: "Stretch for 60 seconds.", category: "Weirdness" },
  
  // Reflection Lite
  { id: 301, text: "Notice what you’re avoiding today.", category: "Reflection" },
  { id: 302, text: "Name one thing you’re grateful for.", category: "Reflection" },
  { id: 303, text: "Think of one recent win, no matter how small.", category: "Reflection" },
  { id: 304, text: "Ask yourself: “What’s the simplest next step?”", category: "Reflection" },
  { id: 305, text: "Forgive yourself for one tiny thing.", category: "Reflection" },
  
  // Playful
  { id: 401, text: "Wave first.", category: "Playful" },
  { id: 402, text: "Say “good morning” to someone unexpected.", category: "Playful" },
  { id: 403, text: "Make someone laugh (even quietly).", category: "Playful" },
  { id: 404, text: "React instead of scrolling.", category: "Playful" },
  { id: 405, text: "Be extra polite on purpose.", category: "Playful" },
  { id: 406, text: "Say “thank you” twice today.", category: "Playful" },
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
