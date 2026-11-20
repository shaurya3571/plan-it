import { site } from "./site";

export const pricingHead = {
  eyebrow: "Pricing",
  title: { lead: "Learn from any course.", em: "Pay only to build new ones." },
  intro:
    "Every course someone has already built is free to join, on every plan, forever. Your first new course from your own YouTube link is free; Pro and Max let you build more every month.",
} as const;

export const billingToggle = {
  monthly: "Monthly",
  yearly: "Yearly · 2 months free",
} as const;

export type Plan = {
  name: string;
  blurb: string;
  /** index 0 = monthly, 1 = yearly */
  price: [string, string];
  period: [string, string];
  note?: string;
  highlight: { lead: string; rest: string };
  features: string[];
  cta: string;
  ctaDisabled?: boolean;
  featured?: boolean;
  badge?: string;
};

export const plans: Plan[] = [
  {
    name: "Free",
    blurb: "Build your first course free.",
    price: ["₹0", "₹0"],
    period: ["forever", "forever"],
    highlight: { lead: "1 free course", rest: "up to 6 hours long" },
    features: [
      "Join any course already built, free forever",
      "Notes, quizzes and placement tests",
      "Roadmaps and daily plans",
    ],
    cta: "Start free",
  },
  {
    name: "Pro",
    blurb: "For learning something every week.",
    price: ["₹499", "₹4,990"],
    period: ["/ month", "/ year"],
    note: "incl. GST",
    badge: "Most popular",
    featured: true,
    highlight: {
      lead: "5 new courses",
      rest: "a month, 30 hours of video in total",
    },
    features: [
      "Everything in Free",
      "Long playlists, up to 10 hours each",
      "Retry any course or lesson that didn't build",
      "Your builds go first when it's busy",
      "Chat support over email",
    ],
    cta: "Coming soon",
    ctaDisabled: true,
  },
  {
    name: "Max",
    blurb: "For heavy learners and teams of one.",
    price: ["₹999", "₹9,990"],
    period: ["/ month", "/ year"],
    note: "incl. GST",
    highlight: {
      lead: "20 new courses",
      rest: "a month, 100 hours of video in total",
    },
    features: [
      "Everything in Pro",
      "Full courses, up to 20 hours each",
      "Top build priority",
      "Early access to new features",
    ],
    cta: "Coming soon",
    ctaDisabled: true,
  },
];

export const faq = {
  heading: "Questions",
  items: [
    {
      q: "What counts as a new course?",
      a: "Pasting a YouTube link nobody has built yet. If the course already exists, it opens instantly and doesn't count.",
    },
    {
      q: "When does my limit reset?",
      a: "Free includes one course per account. On Pro and Max, each build counts for 30 days: a build from 30 days ago frees up its slot and its hours today.",
    },
    {
      q: "What are hours of video?",
      a: "The total length of the videos you build courses from. A 3-hour playlist uses 3 of your monthly hours.",
    },
    {
      q: "Can I cancel?",
      a: "Any time, from Settings → Manage billing. You keep your plan until the end of the period you paid for, and every course you built stays yours.",
    },
    {
      q: "Who handles payments?",
      // TODO(billing): name the merchant of record once one is set up.
      a: "Billing is not live yet. Pro and Max are listed so you can see what is planned; nothing is charged today.",
    },
    {
      q: "Are taxes included?",
      a: "Prices shown in rupees include GST. Prices for other countries will be set when billing goes live.",
    },
    {
      q: "Can I get a refund?",
      a: `Within 7 days of a charge if you haven't built a new course since. Email ${site.email} and we reply within 3–5 working days. See the Refund policy.`,
    },
  ],
} as const;
