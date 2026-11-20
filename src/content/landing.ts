import { ai } from "./site";

/** Headings are "lead" + an emphasised moss-italic tail. */
export type Heading = { lead: string; em: string };

export const hero = {
  badge: ai.badge,
  title: { lead: "Turn any YouTube video into a course you", em: "actually finish." },
  subtitle: "Paste a link. Get lessons, quizzes and a plan that fits your day.",
} as const;

export const featuresHead = {
  eyebrow: "Features",
  title: { lead: "Everything you need to", em: "finish that 6-hour playlist." },
} as const;

export const features = {
  placement: {
    title: "This 6-hour course is 2h 40m for you.",
    body: "A 2-minute placement test finds what you already know and takes those lessons out of your plan.",
    fullLength: "6h 02m",
    yourLength: "2h 40m",
    lessons: [
      { title: "JSX basics", known: true },
      { title: "Components and props", known: true },
      { title: "State with useState", known: false },
      { title: "Effects with useEffect", known: false },
    ],
  },
  notes: {
    title: "Watch it, then read it.",
    body: `Distraction-free video for each lesson, plus study notes ${ai.subject} writes from what was said.`,
    tabs: ["Video", "Article"],
    article: [
      "A transformer reads the whole prompt at once, then predicts one token at a time.",
      "Attention decides which earlier tokens matter for the token being written now.",
      "Because sampling is random, the same prompt can take a different path each run.",
    ],
  },
  quiz: {
    title: "Miss one, replay the moment.",
    body: "Every lesson ends with a quiz. A wrong answer jumps the video to the moment that explains it.",
    question: "Why does the same prompt give different answers?",
    wrongAnswer: "The model forgets the prompt",
    replayLabel: "Replay 3:12 that explains it",
  },
  paste: {
    title: "Any YouTube video or whole playlist → a course.",
    body: "Paste the link straight from YouTube. Lesson 1 is ready to watch while the rest is written.",
    url: "youtube.com/watch?v=7AMjmCTumuo&list=PL-osiE80TeTs…",
    chips: [
      "Playlists up to 20 hours",
      "Notes + quiz per lesson",
      "Day-by-day plan",
      "Placement test",
    ],
  },
  pace: {
    title: "Your pace, every course.",
    body: "Set your daily time once. Every course splits into days, and skipped lessons drop out.",
    options: [30, 60, 90, 120],
    defaultOption: 90,
    courseMinutes: 240,
    courseLabel: "4h course",
  },
  roadmap: {
    title: "Roadmaps: courses from many creators, in stages.",
    body: "Build your own path and share the link. Anyone with it can enroll and track their own progress.",
    stages: ["Python", "Math for ML", "Machine learning", "Gen AI"],
    activeStage: 2,
    learners: "1,240 learners enrolled",
    enrollLabel: "Enroll in roadmap",
  },
  pinned: {
    title: "Notes pinned to the moment.",
    body: "Write while you watch. Each note keeps its time; click it and the video plays from there.",
    notes: [
      { at: "0:42", text: "Attention looks back, never ahead." },
      { at: "2:08", text: "MLP blocks hold most of the weights." },
      { at: "5:01", text: "Sampling explains different answers." },
    ],
  },
} as const;

export const coursesHead = {
  eyebrow: "Popular courses",
  title: { lead: "Courses learners are", em: "taking right now." },
} as const;

export const howHead = {
  eyebrow: "How it works",
  title: { lead: "From a 6-hour video to", em: "a plan you finish." },
} as const;

export const steps = [
  {
    title: "Paste a video or playlist",
    body: `Any YouTube video, or a playlist up to 20 hours. ${ai.subject} plans the lessons and writes study notes and quizzes for each one.`,
  },
  {
    title: "Learn at your pace",
    body: "A 2-minute placement test skips what you know. Set 30 to 120 minutes a day and every course splits into days.",
  },
  {
    title: "Prove it, keep it",
    body: "Miss a quiz question and the video jumps to the moment that explains it. Pin notes to any moment, and chain courses into a roadmap.",
  },
] as const;

export const testimonialsHead = {
  eyebrow: "Learners",
  title: { lead: "People who", em: "actually finished." },
} as const;

// sample — fictional placeholders, replace with real learners before launch
export const testimonials = [
  {
    quote:
      "I had started that 6-hour React video four times. plan-it cut it to two and a half hours and I finished in nine days.",
    name: "Sample Learner",
    role: "Product Designer",
    finished: "Finished: Python for AI · 3 days",
  },
  {
    quote:
      "Getting a question wrong and landing on the exact 40 seconds that explain it is what made it stick.",
    name: "Sample Learner",
    role: "Developer",
    finished: "Finished: Let's Reproduce GPT-2 · 4 days",
  },
  {
    quote:
      "No recommendations, no rabbit holes. Thirty minutes a day and a date to finish by.",
    name: "Sample Learner",
    role: "Backend Developer",
    finished: "Finished: System design basics · 3 days",
  },
] as const;

export const finalCta = {
  eyebrow: "Start today",
  title: { lead: "Your next course starts", em: "today." },
  body: "Paste a video or playlist and start lesson 1 while the rest of the course builds.",
} as const;
