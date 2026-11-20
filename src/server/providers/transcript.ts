import { pythonForAiLessons } from "../../content/courses.ts";
import { live, requireKey } from "./mode.ts";
import { transcriptSchema, type Cue } from "./schemas.ts";

const API = "https://api.supadata.ai/v1/transcript";

/** shortcut: a generated transcript still running after this is given up on. Upgrade by moving the poll into its own Inngest step with a sleep. */
const POLL_BUDGET_MS = 180_000;
const POLL_EVERY_MS = 1_000;

type Chunk = { text?: string; offset?: number };
type Payload = { content?: Chunk[]; jobId?: string; status?: string; error?: unknown };

export async function fetchTranscript(videoExternalId: string): Promise<Cue[]> {
  const cues = live ? await fetchLive(videoExternalId) : mockTranscript();
  return transcriptSchema.parse(cues).sort((a, b) => a.atSeconds - b.atSeconds);
}

function headers() {
  return { "x-api-key": requireKey("SUPADATA_API_KEY") };
}

async function fetchLive(videoExternalId: string): Promise<Cue[]> {
  const url = new URL(API);
  url.searchParams.set("url", `https://www.youtube.com/watch?v=${videoExternalId}`);
  url.searchParams.set("text", "false");

  const res = await fetch(url, { headers: headers(), cache: "no-store" });

  // 206 means "no transcript for this video" and passes res.ok, so check it first.
  if (res.status === 206) {
    throw new Error(`transcript: none available for ${videoExternalId}`);
  }
  if (!res.ok) {
    throw new Error(
      `transcript ${res.status} for ${videoExternalId}: ${(await res.text()).slice(0, 200)}`,
    );
  }

  const payload = (await res.json()) as Payload;
  // Anything needing AI generation over ~20 minutes comes back as a job to poll.
  const chunks = res.status === 202 && payload.jobId ? await pollJob(payload.jobId) : payload.content;
  return toCues(chunks, videoExternalId);
}

async function pollJob(jobId: string): Promise<Chunk[] | undefined> {
  const deadline = Date.now() + POLL_BUDGET_MS;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, POLL_EVERY_MS));

    const res = await fetch(`${API}/${jobId}`, { headers: headers(), cache: "no-store" });
    if (!res.ok) {
      throw new Error(`transcript job ${jobId} ${res.status}`);
    }
    const payload = (await res.json()) as Payload;
    if (payload.status === "completed") return payload.content;
    if (payload.status === "failed") {
      throw new Error(`transcript job ${jobId} failed: ${JSON.stringify(payload.error ?? {})}`);
    }
  }
  throw new Error(`transcript job ${jobId} still running after ${POLL_BUDGET_MS}ms`);
}

function toCues(chunks: Chunk[] | undefined, videoExternalId: string): Cue[] {
  const cues = (chunks ?? [])
    .filter((c): c is { text: string; offset: number } =>
      typeof c.text === "string" && c.text.trim() !== "" && typeof c.offset === "number",
    )
    // Supadata reports offset in milliseconds
    .map((c) => ({ atSeconds: Math.max(0, Math.floor(c.offset / 1000)), text: c.text.trim() }));

  if (cues.length === 0) throw new Error(`transcript: empty for ${videoExternalId}`);
  return cues;
}

function mockTranscript(): Cue[] {
  let at = 0;
  return pythonForAiLessons.flat().map((lesson) => {
    const cue = { atSeconds: at, text: `${lesson.title}. ${lesson.summary}` };
    at += lesson.minutes * 60;
    return cue;
  });
}
