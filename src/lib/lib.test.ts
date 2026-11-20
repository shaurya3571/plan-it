import assert from "node:assert/strict";
import test from "node:test";
import { seededRandom } from "./seeded-random.ts";
import { daysForCourse, formatDuration, initials } from "./plan.ts";
import { parseYoutubeUrl } from "./youtube.ts";

test("seededRandom is deterministic for a seed", () => {
  const a = Array.from({ length: 50 }, seededRandom(20260211));
  const b = Array.from({ length: 50 }, seededRandom(20260211));
  assert.deepEqual(a, b);
});

test("seededRandom differs across seeds and stays in range", () => {
  const a = Array.from({ length: 20 }, seededRandom(1));
  const b = Array.from({ length: 20 }, seededRandom(2));
  assert.notDeepEqual(a, b);
  assert.ok(a.every((n) => n >= 0 && n < 1));
});

test("daysForCourse matches the landing page: 4h course at 90 min is 3 days", () => {
  assert.equal(daysForCourse(240, 90), 3);
  assert.equal(daysForCourse(240, 30), 8);
  assert.equal(daysForCourse(240, 120), 2);
  assert.equal(daysForCourse(45, 90), 1);
  // never divide by zero or return 0 days
  assert.equal(daysForCourse(240, 0), 1);
});

test("formatDuration pads minutes the way the course cards show them", () => {
  assert.equal(formatDuration(316), "5h 16m");
  assert.equal(formatDuration(654), "10h 54m");
  assert.equal(formatDuration(45), "45m");
});

test("parseYoutubeUrl accepts the shapes people paste", () => {
  assert.deepEqual(parseYoutubeUrl("https://www.youtube.com/watch?v=_itqpLVS660"), {
    kind: "video",
    id: "_itqpLVS660",
  });
  assert.deepEqual(parseYoutubeUrl("youtu.be/_itqpLVS660"), {
    kind: "video",
    id: "_itqpLVS660",
  });
  assert.deepEqual(parseYoutubeUrl("https://youtube.com/shorts/_itqpLVS660"), {
    kind: "video",
    id: "_itqpLVS660",
  });
  // a link that opens a video inside a playlist means the playlist
  assert.deepEqual(
    parseYoutubeUrl(
      "https://www.youtube.com/watch?v=_itqpLVS660&list=PL-osiE80TeTsqhIuOqKhwlXsIBIdSeYtc",
    ),
    { kind: "playlist", id: "PL-osiE80TeTsqhIuOqKhwlXsIBIdSeYtc" },
  );
});

test("initials derives a sidebar avatar from a display name", () => {
  assert.equal(initials("Shaurya Agrawal"), "SA");
  assert.equal(initials("shaurya"), "S");
  assert.equal(initials("  Shaurya   Agrawal  "), "SA");
  assert.equal(initials(""), "?");
});

test("parseYoutubeUrl rejects anything that is not YouTube", () => {
  assert.equal(parseYoutubeUrl(""), null);
  assert.equal(parseYoutubeUrl("not a url"), null);
  assert.equal(parseYoutubeUrl("https://vimeo.com/123456"), null);
  // lookalike host must not pass
  assert.equal(parseYoutubeUrl("https://youtube.com.evil.test/watch?v=_itqpLVS660"), null);
  assert.equal(parseYoutubeUrl("https://www.youtube.com/watch?v=tooshort"), null);
});
