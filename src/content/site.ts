/**
 * Every brand-level string lives here. Nothing in components hardcodes copy.
 */

export const site = {
  name: "plan-it",
  /** the logotype splits: plain + accented */
  wordmark: { head: "plan", tail: "-it" },
  tagline: "Turn any YouTube course into one you actually finish.",
  description:
    "Paste any YouTube video or playlist and plan-it turns it into a distraction-free course: bite-sized lessons, a daily plan, quizzes that replay the moment you missed, and notes pinned to the video.",
  url: "https://plan-it.local",
  email: "reachshauryaagrawal@gmail.com",
  author: { name: "Shaurya Agrawal", location: "India" },
  year: 2026,
  footerNote: "Made for people who finish what they start.",
  creatorNote: "Videos play in YouTube's own player. Creators keep their views.",
} as const;

/**
 * TODO(vendor): no model partnership yet, so every AI credit is generic.
 * Swap these three strings once the backend picks a provider — they are the
 * only place a vendor name appears anywhere in the UI.
 */
export const ai = {
  /** hero badge */
  badge: "Powered by AI",
  /** short subject used mid-sentence, e.g. "study notes {subject} writes" */
  subject: "AI",
  /** long form for the About page */
  credit:
    "AI models read the transcript, split it into lessons, and write study notes, quizzes and a placement test for each course.",
} as const;

export const nav = {
  main: [
    { label: "Features", href: "/#features" },
    { label: "Courses", href: "/#courses" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Pricing", href: "/pricing" },
  ],
  footer: [
    {
      heading: "Product",
      links: [
        { label: "Features", href: "/#features" },
        { label: "Courses", href: "/#courses" },
        { label: "How it works", href: "/#how-it-works" },
        { label: "Community", href: "/community" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact us", href: `mailto:${site.email}` },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Refunds", href: "/refunds" },
      ],
    },
  ],
} as const;

export const cta = {
  primary: { label: "Start learning", href: "/login" },
  secondary: { label: "Paste a link", href: "/new" },
  footer: { label: "Build your first course", href: "/new" },
} as const;
