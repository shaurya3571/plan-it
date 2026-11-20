import { popularCourses } from "./courses";

export const sidebarNav = [
  { label: "Home", href: "/dashboard", icon: "home" },
  { label: "New course", href: "/new", icon: "plus" },
  { label: "Community", href: "/community", icon: "users" },
  { label: "Roadmaps", href: "/community#roadmaps", icon: "route" },
] as const;

/** Signed-in mock. No auth, so every shell page reads this. */
export const learner = {
  name: "Shaurya",
  initials: "SA",
  streak: 9,
  minutesPerDay: 90,
  /** today's plan */
  today: {
    courseSlug: popularCourses[1].slug,
    courseTitle: popularCourses[1].title,
    day: 1,
    totalDays: 3,
    lessonsDone: 4,
    lessonsTotal: 13,
    nextLesson: { n: 5, title: "Installing and Importing Python Packages", minutes: 5 },
  },
  enrolled: [popularCourses[1], popularCourses[4], popularCourses[0]],
  roadmaps: [
    {
      title: "Become an AI engineer",
      stages: ["Python", "Math for ML", "Machine learning", "Gen AI"],
      stage: 2,
      learners: 1240,
    },
    {
      title: "Backend from scratch",
      stages: ["HTTP basics", "Databases", "System design"],
      stage: 1,
      learners: 318,
    },
  ],
} as const;
