"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { BUILD_STEPS, BUILD_STEP_TOTAL } from "@/content/build-steps";
import { courseSlug } from "@/lib/plan";
import { parseYoutubeUrl, type YoutubeTarget } from "@/lib/youtube";
import { requireUser } from "@/server/auth/guards";
import { db } from "@/server/db";
import { buildJobs, buildSteps, courses, videoSources } from "@/server/db/schema";
import { BUILD_REQUESTED, inngest } from "@/server/inngest/client";
import { fetchSource } from "@/server/providers/youtube";

export type BuildFormState = { error: string | null };

const input = z.object({
  url: z.string().min(1).max(500),
  // the same range profiles.minutes_per_day is constrained to
  minutesPerDay: z.coerce.number().int().min(30).max(240),
});

export async function startBuild(
  _previous: BuildFormState,
  formData: FormData,
): Promise<BuildFormState> {
  // Server functions are reachable by direct POST, not just through the form.
  const user = await requireUser();

  const parsed = input.safeParse({
    url: formData.get("url"),
    minutesPerDay: formData.get("minutesPerDay"),
  });
  if (!parsed.success) return { error: "Check the link and the minutes a day." };

  const target = parseYoutubeUrl(parsed.data.url);
  if (!target) {
    return { error: "That doesn't look like a YouTube video or playlist link." };
  }

  let destination: string;
  try {
    destination = await queueBuild(user.id, target, parsed.data.minutesPerDay);
  } catch (cause) {
    console.error("startBuild failed", cause);
    return { error: "Could not read that link from YouTube. Try again in a moment." };
  }

  // outside the try: redirect works by throwing
  redirect(destination);
}

async function queueBuild(
  userId: string,
  target: NonNullable<YoutubeTarget>,
  minutesPerDay: number,
) {
  // Fetched here rather than in the pipeline because the title becomes the slug
  // and the duration is NOT NULL on courses, both needed before we can redirect.
  const source = await fetchSource(target);

  const [sourceRow] = await db
    .insert(videoSources)
    .values({
      provider: "youtube",
      externalId: source.externalId,
      kind: source.kind,
      title: source.title,
      channelTitle: source.channelTitle,
      durationSeconds: source.durationSeconds,
      itemCount: source.itemCount,
      chapterCount: source.chapterCount,
      rawMeta: source,
    })
    .onConflictDoUpdate({
      target: [videoSources.provider, videoSources.externalId],
      set: {
        title: source.title,
        channelTitle: source.channelTitle,
        durationSeconds: source.durationSeconds,
        itemCount: source.itemCount,
        chapterCount: source.chapterCount,
        rawMeta: source,
        fetchedAt: new Date(),
      },
    })
    .returning({ id: videoSources.id });

  // courses.source_id is globally unique: one course per video or playlist, so a
  // second person pasting the same link joins the existing course.
  const [existing] = await db
    .select({ slug: courses.slug, buildStatus: courses.buildStatus })
    .from(courses)
    .where(eq(courses.sourceId, sourceRow!.id));
  if (existing) {
    return existing.buildStatus === "ready"
      ? `/courses/${existing.slug}`
      : `/build/${existing.slug}`;
  }

  const [course] = await db
    .insert(courses)
    .values({
      slug: courseSlug(source.title),
      sourceId: sourceRow!.id,
      title: source.title,
      creator: source.channelTitle,
      totalMinutes: Math.max(1, Math.round(source.durationSeconds / 60)),
      createdBy: userId,
      buildStatus: "building",
    })
    .returning({ id: courses.id, slug: courses.slug });

  const [job] = await db
    .insert(buildJobs)
    .values({
      courseId: course!.id,
      sourceId: sourceRow!.id,
      requestedBy: userId,
      stepTotal: BUILD_STEP_TOTAL,
    })
    .returning({ id: buildJobs.id });

  await db.insert(buildSteps).values(
    BUILD_STEPS.map((step, idx) => ({
      buildJobId: job!.id,
      idx,
      key: step.key,
      label: step.label,
      providerLabel: step.providerLabel,
    })),
  );

  await inngest.send({
    name: BUILD_REQUESTED,
    data: { buildJobId: job!.id, minutesPerDay },
  });

  return `/build/${course!.slug}`;
}
