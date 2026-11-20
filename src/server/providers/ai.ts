import { pythonForAiLessons } from "../../content/courses.ts";
import { lessonSample } from "../../content/lesson.ts";
import { live, requireKey } from "./mode.ts";
import {
  noteBlocksSchema,
  placementTestSchema,
  plannedLessonsSchema,
  quizSchema,
  type Cue,
  type NoteBlock,
  type PlacementQuestion,
  type PlannedLesson,
  type Quiz,
} from "./schemas.ts";

/**
 * Planning and the placement test get the bigger model; per-lesson notes and
 * quizzes are bulk work and get the cheaper one. The user-facing names live in
 * src/content/build-steps.ts.
 */
type Tier = "ultra" | "super";

/** shortcut: long transcripts are truncated to this many characters rather than chunked and summarised. */
const TRANSCRIPT_LIMIT = 12_000;

/**
 * An OpenAI-compatible /chat/completions call, so the base URL and model ids are
 * configuration rather than anything this file needs to know about.
 */
async function complete(tier: Tier, system: string, user: string): Promise<unknown> {
  const base = requireKey("NEMOTRON_BASE_URL").replace(/\/+$/, "");
  const model = requireKey(tier === "ultra" ? "NEMOTRON_MODEL_ULTRA" : "NEMOTRON_MODEL_SUPER");

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${requireKey("NEMOTRON_API_KEY")}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`ai ${model} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  const payload = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error(`ai ${model}: response had no content`);

  // Malformed JSON throws, which Inngest retries - better than salvaging half a plan.
  return JSON.parse(content);
}

function cueText(cues: Cue[]) {
  let out = "";
  for (const cue of cues) {
    const line = `[${cue.atSeconds}] ${cue.text}\n`;
    if (out.length + line.length > TRANSCRIPT_LIMIT) break;
    out += line;
  }
  return out;
}

export async function planLessons(input: {
  videoExternalId: string;
  videoTitle: string;
  durationSeconds: number;
  cues: Cue[];
}): Promise<PlannedLesson[]> {
  if (!live) return mockPlan(input.videoExternalId, input.durationSeconds);

  const raw = await complete(
    "ultra",
    "You split a video transcript into sequential lessons for a study course. " +
      'Reply with JSON {"lessons":[{"title","summary","startSeconds","endSeconds"}]}. ' +
      "Lessons must be in order, must not overlap, and must cover the whole video. " +
      "Keep each title under 80 characters and each summary to one sentence.",
    `Video: ${input.videoTitle}\nLength in seconds: ${input.durationSeconds}\n\nTranscript lines are "[seconds] text":\n${cueText(input.cues)}`,
  );

  const lessons = (raw as { lessons?: unknown[] }).lessons ?? [];
  return plannedLessonsSchema.parse(
    lessons.map((lesson) => ({
      ...(lesson as object),
      videoExternalId: input.videoExternalId,
    })),
  );
}

export async function writeNotes(input: {
  lessonTitle: string;
  lessonSummary: string;
  cues: Cue[];
}): Promise<NoteBlock[]> {
  if (!live) return noteBlocksSchema.parse(mockNotes(input.lessonTitle));

  const raw = await complete(
    "super",
    "You write study notes for one lesson of a video course. " +
      'Reply with JSON {"blocks":[{"heading","body"}]} using three to five blocks. ' +
      "Write plain prose a learner can revise from. Do not invent anything absent from the transcript.",
    `Lesson: ${input.lessonTitle}\n${input.lessonSummary}\n\nTranscript:\n${cueText(input.cues)}`,
  );
  return noteBlocksSchema.parse((raw as { blocks?: unknown }).blocks ?? []);
}

export async function writeQuiz(input: {
  lessonTitle: string;
  lessonSummary: string;
  startSeconds: number;
  endSeconds: number;
  cues: Cue[];
}): Promise<Quiz> {
  if (!live) {
    return quizSchema.parse(
      mockQuiz(input.lessonTitle, input.startSeconds, input.endSeconds),
    );
  }

  const raw = await complete(
    "super",
    "You write one multiple-choice question checking understanding of a lesson. " +
      'Reply with JSON {"question","explanation","replayAtSeconds","options":[{"text","isCorrect"}]}. ' +
      "Give three or four options with exactly one correct. replayAtSeconds is the second in the " +
      "video where the answer is explained, and must fall inside the lesson's range.",
    `Lesson: ${input.lessonTitle}\n${input.lessonSummary}\nLesson covers seconds ${input.startSeconds} to ${input.endSeconds}.\n\nTranscript:\n${cueText(input.cues)}`,
  );
  return quizSchema.parse(raw);
}

export async function writePlacementTest(input: {
  courseTitle: string;
  lessons: { n: number; title: string; summary: string }[];
}): Promise<PlacementQuestion[]> {
  if (!live) return placementTestSchema.parse(mockPlacement(input.lessons));

  const raw = await complete(
    "ultra",
    "You write a short placement test that lets a learner skip lessons they already know. " +
      'Reply with JSON {"questions":[{"question","explanation","lessonNs":[numbers],"options":[{"text","isCorrect"}]}]}. ' +
      "Use five to eight questions. lessonNs lists the lesson numbers a correct answer lets them skip. " +
      "Give three or four options with exactly one correct.",
    `Course: ${input.courseTitle}\n\nLessons:\n${input.lessons
      .map((l) => `${l.n}. ${l.title} - ${l.summary}`)
      .join("\n")}`,
  );
  return placementTestSchema.parse((raw as { questions?: unknown }).questions ?? []);
}

// --- mocks -----------------------------------------------------------------
// Reuse the hand-written course content so a keyless build produces something
// that reads like a real course rather than lorem ipsum.

function mockPlan(videoExternalId: string, durationSeconds: number): PlannedLesson[] {
  const source = pythonForAiLessons.flat();
  const lessons: PlannedLesson[] = [];
  let at = 0;

  for (const lesson of source) {
    if (at >= durationSeconds) break;
    const endSeconds = Math.min(at + lesson.minutes * 60, durationSeconds);
    if (endSeconds <= at) break;
    lessons.push({
      title: lesson.title,
      summary: lesson.summary,
      startSeconds: at,
      endSeconds,
      videoExternalId,
    });
    at = endSeconds;
  }

  // a video shorter than the first mock lesson still needs one lesson
  if (lessons.length === 0) {
    const first = source[0]!;
    lessons.push({
      title: first.title,
      summary: first.summary,
      startSeconds: 0,
      endSeconds: Math.max(1, durationSeconds),
      videoExternalId,
    });
  }
  return plannedLessonsSchema.parse(lessons);
}

function mockNotes(lessonTitle: string): NoteBlock[] {
  return lessonSample.article.map((block, i) => ({
    heading: i === 0 ? `What ${lessonTitle} covers` : block.heading,
    body: block.body,
  }));
}

function mockQuiz(lessonTitle: string, startSeconds: number, endSeconds: number): Quiz {
  const { quiz } = lessonSample;
  return {
    question: quiz.question,
    explanation: `${quiz.explanation} (${lessonTitle})`,
    // the sample's "4:12" is meaningless outside its own lesson, so point at the middle of this one
    replayAtSeconds: Math.floor((startSeconds + endSeconds) / 2),
    options: quiz.options.map((option) => ({ text: option.text, isCorrect: option.correct })),
  };
}

function mockPlacement(
  lessons: { n: number; title: string; summary: string }[],
): PlacementQuestion[] {
  const { quiz } = lessonSample;
  // five questions spread across the course, each covering the run of lessons up to it
  const step = Math.max(1, Math.floor(lessons.length / 5));
  const picked = lessons.filter((_, i) => i % step === 0).slice(0, 5);

  return picked.map((lesson, i) => {
    const previous = picked[i - 1];
    const from = previous ? previous.n + 1 : lessons[0]!.n;
    const covered = lessons.filter((l) => l.n >= from && l.n <= lesson.n).map((l) => l.n);
    return {
      question: `${lesson.title}: ${quiz.question}`,
      explanation: quiz.explanation,
      lessonNs: covered.length > 0 ? covered : [lesson.n],
      options: quiz.options.map((option) => ({ text: option.text, isCorrect: option.correct })),
    };
  });
}
