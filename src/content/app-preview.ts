import { ai } from "./site";

/** The "building your course" screen, shown in the hero and reused on /new. */
export const buildPreview = {
  url: "plan-it.app/build/python-for-ai-full-beginner-course-np4k",
  note: "Keeps building if you leave. Find it in My courses.",
  step: "Step 1 of 2 · Python for AI - Full Beginner Course · Dave Ebbelaar",
  progress: 95,
  tasks: [
    { at: "0:00", label: "Fetching the transcript" },
    { at: "0:06", label: `Planning the lessons with ${ai.subject}` },
    { at: "0:21", label: "Writing study notes for lessons 1-12" },
    { at: "0:48", label: "Writing quizzes for lessons 1-12" },
    { at: "1:12", label: "Building the placement test" },
    { at: "1:30", label: "Splitting the course into days" },
  ],
  stats: [
    { label: "Lessons", value: "37" },
    { label: "Days", value: "3" },
    { label: "Quizzes", value: "37" },
  ],
} as const;
