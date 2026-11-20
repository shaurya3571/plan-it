import assert from "node:assert/strict";
import test from "node:test";
import { countChapters, fetchSource, parseIsoDuration } from "./youtube.ts";
import { fetchTranscript } from "./transcript.ts";
import { planLessons, writeNotes, writePlacementTest, writeQuiz } from "./ai.ts";

// PROVIDERS is unset here, so every call below goes through the mock path. The
// point of these tests is that the mocks satisfy the same zod schemas the live
// responses are parsed with - fetchSource and friends throw on a bad shape.

test("parseIsoDuration reads the shapes the YouTube API returns", () => {
  assert.equal(parseIsoDuration("PT5H16M"), 5 * 3600 + 16 * 60);
  assert.equal(parseIsoDuration("PT1H2M3S"), 3723);
  assert.equal(parseIsoDuration("PT45S"), 45);
  assert.equal(parseIsoDuration("PT12M"), 720);
  assert.equal(parseIsoDuration("P1DT2H"), 86400 + 7200);
  // a duration we cannot read must not quietly become zero, it drives the whole plan
  assert.throws(() => parseIsoDuration(undefined));
  assert.throws(() => parseIsoDuration("90 minutes"));
});

test("countChapters only counts a real chapter list", () => {
  const description = "Intro\n0:00 Welcome\n1:30 Setup\n12:05 First script\nthanks for watching";
  assert.equal(countChapters(description), 3);
  // YouTube needs three or more timestamps before it shows chapters at all
  assert.equal(countChapters("0:00 Welcome\n1:30 Setup"), 0);
  assert.equal(countChapters("no timestamps here"), 0);
  assert.equal(countChapters("1:02:03 deep into a long video\n0:00 a\n0:30 b"), 3);
});

test("mock fetchSource returns a schema-valid video source", async () => {
  const source = await fetchSource({ kind: "video", id: "ygXn5nV5qFc" });
  assert.equal(source.kind, "video");
  assert.equal(source.externalId, "ygXn5nV5qFc");
  assert.equal(source.durationSeconds, 316 * 60);
  assert.equal(source.videos.length, 1);
});

test("mock fetchSource returns a schema-valid playlist whose duration is its videos", async () => {
  const source = await fetchSource({ kind: "playlist", id: "PL-osiE80TeTsqhIuOqKhwlXsIBIdSeYtc" });
  assert.equal(source.kind, "playlist");
  assert.ok(source.videos.length > 1);
  assert.equal(source.itemCount, source.videos.length);
  assert.equal(
    source.durationSeconds,
    source.videos.reduce((total, v) => total + v.durationSeconds, 0),
  );
});

test("mock fetchTranscript returns ordered, non-empty cues", async () => {
  const cues = await fetchTranscript("ygXn5nV5qFc");
  assert.ok(cues.length > 0);
  for (let i = 1; i < cues.length; i++) {
    assert.ok(cues[i]!.atSeconds >= cues[i - 1]!.atSeconds);
  }
  assert.ok(cues.every((cue) => cue.text.length > 0));
});

test("mock planLessons covers the video in order without overlapping", async () => {
  const durationSeconds = 316 * 60;
  const lessons = await planLessons({
    videoExternalId: "ygXn5nV5qFc",
    videoTitle: "Python for AI",
    durationSeconds,
    cues: await fetchTranscript("ygXn5nV5qFc"),
  });

  assert.ok(lessons.length > 1);
  assert.equal(lessons[0]!.startSeconds, 0);
  for (const lesson of lessons) {
    assert.ok(lesson.endSeconds > lesson.startSeconds);
    assert.ok(lesson.endSeconds <= durationSeconds, "a lesson must not run past the video");
    assert.equal(lesson.videoExternalId, "ygXn5nV5qFc");
  }
  for (let i = 1; i < lessons.length; i++) {
    assert.equal(lessons[i]!.startSeconds, lessons[i - 1]!.endSeconds);
  }
});

test("mock planLessons still returns one lesson for a very short video", async () => {
  const lessons = await planLessons({
    videoExternalId: "shortvideo1",
    videoTitle: "Thirty seconds",
    durationSeconds: 30,
    cues: [],
  });
  assert.equal(lessons.length, 1);
  assert.equal(lessons[0]!.startSeconds, 0);
  assert.equal(lessons[0]!.endSeconds, 30);
});

test("mock writeNotes returns schema-valid blocks", async () => {
  const blocks = await writeNotes({
    lessonTitle: "Installing and Importing Python Packages",
    lessonSummary: "Install the requests package with pip.",
    cues: [],
  });
  assert.ok(blocks.length >= 1);
  assert.ok(blocks.every((b) => b.heading.length > 0 && b.body.length > 0));
});

test("mock writeQuiz has exactly one correct option and replays inside the lesson", async () => {
  const quiz = await writeQuiz({
    lessonTitle: "Installing and Importing Python Packages",
    lessonSummary: "Install the requests package with pip.",
    startSeconds: 600,
    endSeconds: 900,
    cues: [],
  });
  assert.equal(quiz.options.filter((o) => o.isCorrect).length, 1);
  assert.ok(quiz.replayAtSeconds! >= 600 && quiz.replayAtSeconds! <= 900);
});

test("mock writePlacementTest covers lessons without repeating one", async () => {
  const lessons = Array.from({ length: 37 }, (_, i) => ({
    n: i + 1,
    title: `Lesson ${i + 1}`,
    summary: "Summary.",
  }));
  const questions = await writePlacementTest({ courseTitle: "Python for AI", lessons });

  assert.ok(questions.length >= 1 && questions.length <= 8);
  const covered = questions.flatMap((q) => q.lessonNs);
  assert.equal(new Set(covered).size, covered.length, "a lesson must not be skippable twice");
  for (const question of questions) {
    assert.equal(question.options.filter((o) => o.isCorrect).length, 1);
  }
});
