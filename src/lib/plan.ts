/** "4h course · 3 days" at 90 min/day — the pace maths the landing page shows. */
export function daysForCourse(totalMinutes: number, minutesPerDay: number) {
  if (minutesPerDay <= 0) return 1;
  return Math.max(1, Math.ceil(totalMinutes / minutesPerDay));
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
