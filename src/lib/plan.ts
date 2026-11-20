/** "4h course · 3 days" at 90 min/day — the pace maths the landing page shows. */
export function daysForCourse(totalMinutes: number, minutesPerDay: number) {
  if (minutesPerDay <= 0) return 1;
  return Math.max(1, Math.ceil(totalMinutes / minutesPerDay));
}

/**
 * "Python for AI - Full Beginner Course" -> "python-for-ai-full-beginner-course-np4k".
 * The suffix keeps two courses of the same name apart; courses.slug is unique, so a
 * collision fails the insert rather than overwriting anything.
 */
export function courseSlug(title: string) {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .slice(0, 60)
    .replace(/^-+|-+$/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).padEnd(4, "0");
  return `${base || "course"}-${suffix}`;
}

/**
 * Greedy fill, which is what the hand-written course data imitates: a lesson
 * goes on today unless it would push today past the budget. A lesson longer
 * than the whole budget still gets a day of its own rather than being dropped.
 */
export function packIntoDays<T extends { minutes: number }>(
  lessons: readonly T[],
  minutesPerDay: number,
): T[][] {
  if (lessons.length === 0) return [];

  const budget = minutesPerDay > 0 ? minutesPerDay : 90;
  const days: T[][] = [];
  let day: T[] = [];
  let used = 0;

  for (const lesson of lessons) {
    if (day.length > 0 && used + lesson.minutes > budget) {
      days.push(day);
      day = [];
      used = 0;
    }
    day.push(lesson);
    used += lesson.minutes;
  }
  if (day.length > 0) days.push(day);
  return days;
}

/** 376 -> "6h 16m", 46 -> "46m" */
export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

/** 12 -> "12m" for a single lesson row. */
export function formatLesson(minutes: number) {
  return `${minutes}m`;
}

/** "Shaurya Agrawal" -> "SA", "shaurya" -> "S", "" -> "?" for the sidebar avatar. */
export function initials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase());
  return letters.join("") || "?";
}
