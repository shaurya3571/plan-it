import { ai, site } from "./site";

export const about = {
  eyebrow: "About",
  title: { lead: "plan-it.", em: "" },
  lede: "The best teachers in the world are on YouTube, for free. What YouTube doesn't give you is a course: a plan, a finish line, and a way to check you actually understood. plan-it adds those, and nothing else.",
  sections: [
    {
      heading: "How it works",
      // TODO(vendor): name the model provider here once the backend picks one.
      body: [
        `Paste a video or playlist. ${ai.credit}`,
        "Videos play in YouTube's own player, so creators keep their views.",
      ],
    },
    {
      heading: "Who's building it",
      body: [
        `I'm ${site.author.name}, and I build plan-it on my own. It started with a playlist I kept restarting: it sat in Watch Later for months, I got two videos in three separate times, and never reached the end. The teaching was never the problem. The missing structure was.`,
        "So plan-it is the smallest thing that fixes that: split a long video into lessons, skip what you already know, give each lesson a quiz that sends you back to the exact moment you missed, and spread the whole thing across however many minutes a day you actually have.",
        "It is early, and I ship it in public. If something builds badly, I want to hear about it.",
      ],
    },
    {
      heading: "Get in touch",
      body: [
        `Questions, ideas or a course that didn't build right? Write to ${site.email}, or build your first course.`,
      ],
    },
  ],
} as const;
