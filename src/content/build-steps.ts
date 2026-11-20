import { ai } from "./site";

/**
 * The six steps of a course build, in order. Shared by the server action that
 * creates the pending rows, the Inngest function that works through them, and
 * the /build/[slug] screen that renders them, so a step is described once.
 *
 * The landing page's buildPreview keeps its own copy on purpose: it is static
 * marketing copy with invented timings and should not move when the pipeline does.
 */
export const BUILD_STEPS = [
  { key: "transcript", label: "Fetching the transcript", providerLabel: "SUPADATA" },
  {
    key: "plan",
    label: `Planning the lessons with ${ai.subject}`,
    providerLabel: "NEMOTRON 3 ULTRA",
  },
  { key: "notes", label: "Writing study notes", providerLabel: "NEMOTRON 3 SUPER" },
  { key: "quizzes", label: "Writing quizzes", providerLabel: "NEMOTRON 3 SUPER" },
  { key: "placement", label: "Building the placement test", providerLabel: "NEMOTRON 3 ULTRA" },
  { key: "days", label: "Splitting the course into days", providerLabel: null },
] as const;

export const BUILD_STEP_TOTAL = BUILD_STEPS.length;

export type BuildStepStatus = "pending" | "working" | "done" | "failed";
