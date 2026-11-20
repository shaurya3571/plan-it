import { site } from "./site";

/**
 * TODO(legal): plan-it has no backend, accounts or payments yet, so these
 * pages describe that state honestly rather than copying a policy that would
 * not be true. Expand each section — and have it reviewed — before launch.
 */

export type LegalPage = {
  slug: string;
  metaTitle: string;
  eyebrow: string;
  title: { lead: string; em: string };
  lastUpdated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

const LAST_UPDATED = "November 5, 2026";

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    metaTitle: "Privacy policy",
    eyebrow: "Legal",
    title: { lead: "Privacy", em: "policy." },
    lastUpdated: LAST_UPDATED,
    intro:
      "This policy explains what plan-it collects, why, who it is shared with, and how you can see, change or delete it.",
    sections: [
      {
        heading: "1. Who we are",
        body: [
          `plan-it ("we", "us") turns YouTube videos and playlists into structured courses with lessons, quizzes and a study plan. plan-it is built and operated by ${site.author.name}. You can reach us at ${site.email}.`,
        ],
      },
      {
        heading: "2. What we collect today",
        body: [
          "plan-it is currently a front-end preview with no accounts, no database and no server-side storage. Nothing you type into it is sent anywhere or kept.",
          "The only thing stored is your light/dark theme preference, saved in your own browser's local storage. Clearing site data removes it.",
        ],
      },
      {
        heading: "3. What will be collected when accounts open",
        body: [
          "When sign-in goes live this section will describe, specifically: the profile fields received from each sign-in provider, the YouTube links you build courses from, your notes, quiz answers, chosen pace and progress, and the session cookie and server logs needed to keep the service running and secure.",
        ],
      },
      {
        heading: "4. YouTube",
        body: [
          "Courses are built around public YouTube videos, and videos play in YouTube's own embedded player, which may set its own cookies. We do not download or store video or audio files. Using plan-it alongside embedded YouTube content also means Google's own terms and privacy policy apply to that player.",
        ],
      },
      {
        heading: "5. Who we share it with",
        body: [
          "Nobody. There is no analytics, no advertising and no third-party tracking on this site today. When processing, hosting, payment or AI providers are added, each one will be named here before it handles any of your data.",
        ],
      },
      {
        heading: "6. Your rights",
        body: [
          `You can ask to see, correct, export or delete any personal information we hold by emailing ${site.email}. Depending on where you live you may have further rights under local law, including the right to complain to a data protection authority. We reply to every request within 30 days.`,
        ],
      },
      {
        heading: "7. Children",
        body: [
          "plan-it is not meant for children under 13, or under 16 where local law requires. We do not knowingly collect their information.",
        ],
      },
      {
        heading: "8. Changes to this policy",
        body: [
          "If we change this policy we will update the date at the top, and for significant changes we will tell signed-in users directly.",
        ],
      },
      {
        heading: "9. Contact",
        body: [`Questions about privacy? Email ${site.email}.`],
      },
    ],
  },
  {
    slug: "terms",
    metaTitle: "Terms and conditions",
    eyebrow: "Legal",
    title: { lead: "Terms and", em: "conditions." },
    lastUpdated: LAST_UPDATED,
    intro:
      "These terms cover your use of plan-it. By using the site you agree to them.",
    sections: [
      {
        heading: "1. The service",
        body: [
          "plan-it turns a public YouTube video or playlist into a structured course: lessons, study notes, quizzes, a placement test and a day-by-day plan. Videos play in YouTube's own player; we do not host, download or redistribute them, and creators keep their views.",
        ],
      },
      {
        heading: "2. Current status",
        body: [
          "plan-it is a preview. There are no accounts and no payments yet, and the content you see is sample data. Features described on the site may change or not ship.",
        ],
      },
      {
        heading: "3. Acceptable use",
        body: [
          "Do not use plan-it to break the law, to infringe anyone's rights, or to build courses from content you have no right to use. Do not attempt to disrupt the service or access it in automated ways that degrade it for other people.",
        ],
      },
      {
        heading: "4. Your content",
        body: [
          "Notes and answers you write stay yours. Course material generated from a public video may be reused for other learners who add the same video; it never includes your personal notes, answers or account details.",
        ],
      },
      {
        heading: "5. Third-party content",
        body: [
          "Course material is generated from third-party videos and is provided as-is. It can be incomplete or wrong. Check anything that matters against the original video.",
        ],
      },
      {
        heading: "6. Liability",
        body: [
          "plan-it is provided without warranties, to the extent the law allows. We are not liable for indirect or consequential loss arising from your use of it.",
        ],
      },
      {
        heading: "7. Changes and contact",
        body: [
          `We may update these terms; the date at the top will change. Questions go to ${site.email}.`,
        ],
      },
    ],
  },
  {
    slug: "refunds",
    metaTitle: "Refund and cancellation policy",
    eyebrow: "Legal",
    title: { lead: "Refund and", em: "cancellation policy." },
    lastUpdated: LAST_UPDATED,
    intro:
      "What happens when you cancel a plan or ask for your money back.",
    sections: [
      {
        heading: "1. Billing is not live",
        body: [
          "plan-it does not charge anyone today. The Pro and Max plans on the pricing page show what is planned; no payment method is collected and no money changes hands.",
        ],
      },
      {
        heading: "2. Cancelling",
        body: [
          "When paid plans open, you will be able to cancel at any time from Settings → Manage billing. You keep your plan until the end of the period you already paid for, and every course you built stays yours.",
        ],
      },
      {
        heading: "3. Refunds",
        body: [
          `The intended policy is a full refund within 7 days of a charge, provided you have not built a new course since that charge. Email ${site.email} and we reply within 3–5 working days.`,
        ],
      },
      {
        heading: "4. Failed builds",
        body: [
          "If a course fails to build, retrying it will not count against your monthly allowance. If it fails repeatedly, write to us and we will credit the build back.",
        ],
      },
      {
        heading: "5. Contact",
        body: [`Billing questions go to ${site.email}.`],
      },
    ],
  },
];

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug) ?? null;
}
