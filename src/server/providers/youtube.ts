import type { YoutubeTarget } from "../../lib/youtube.ts";
import { popularCourses } from "../../content/courses.ts";
import { live, requireKey } from "./mode.ts";
import { sourceMetaSchema, type SourceMeta } from "./schemas.ts";

const API = "https://www.googleapis.com/youtube/v3";

/** shortcut: a playlist past this many videos is truncated, not rejected. Upgrade when someone hits it. */
const MAX_PLAYLIST_ITEMS = 200;

type Target = NonNullable<YoutubeTarget>;

export async function fetchSource(target: Target): Promise<SourceMeta> {
  const meta = live ? await fetchLive(target) : mockSource(target);
  return sourceMetaSchema.parse(meta);
}

async function get(path: string, params: Record<string, string>) {
  const url = new URL(`${API}/${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  url.searchParams.set("key", requireKey("YOUTUBE_API_KEY"));

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`youtube ${path} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  return (await res.json()) as { items?: unknown[]; nextPageToken?: string };
}

type VideoItem = {
  id: string;
  snippet?: { title?: string; channelTitle?: string; description?: string };
  contentDetails?: { duration?: string };
};

async function fetchVideos(ids: string[]) {
  const out: VideoItem[] = [];
  // the API takes at most 50 ids per call
  for (let i = 0; i < ids.length; i += 50) {
    const { items } = await get("videos", {
      part: "snippet,contentDetails",
      id: ids.slice(i, i + 50).join(","),
    });
    out.push(...((items ?? []) as VideoItem[]));
  }
  return out;
}

async function fetchLive(target: Target): Promise<SourceMeta> {
  if (target.kind === "video") {
    const [video] = await fetchVideos([target.id]);
    if (!video) throw new Error(`youtube: video ${target.id} not found`);

    const title = video.snippet?.title ?? target.id;
    const durationSeconds = parseIsoDuration(video.contentDetails?.duration);
    return {
      externalId: target.id,
      kind: "video",
      title,
      channelTitle: video.snippet?.channelTitle ?? null,
      durationSeconds,
      itemCount: null,
      chapterCount: countChapters(video.snippet?.description ?? ""),
      videos: [{ externalId: target.id, title, durationSeconds }],
    };
  }

  const { items: playlists } = await get("playlists", {
    part: "snippet",
    id: target.id,
  });
  const playlist = (playlists ?? [])[0] as
    | { snippet?: { title?: string; channelTitle?: string } }
    | undefined;
  if (!playlist) throw new Error(`youtube: playlist ${target.id} not found`);

  const ids: string[] = [];
  let pageToken: string | undefined;
  do {
    const page = await get("playlistItems", {
      part: "contentDetails",
      playlistId: target.id,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    });
    for (const item of (page.items ?? []) as { contentDetails?: { videoId?: string } }[]) {
      const id = item.contentDetails?.videoId;
      if (id) ids.push(id);
    }
    pageToken = page.nextPageToken;
  } while (pageToken && ids.length < MAX_PLAYLIST_ITEMS);

  const videos = (await fetchVideos(ids.slice(0, MAX_PLAYLIST_ITEMS)))
    .map((v) => ({
      externalId: v.id,
      title: v.snippet?.title ?? v.id,
      durationSeconds: parseIsoDuration(v.contentDetails?.duration),
    }))
    // private and deleted entries come back as zero-length and would break the schema
    .filter((v) => v.durationSeconds > 0);
  if (videos.length === 0) throw new Error(`youtube: playlist ${target.id} has no playable videos`);

  return {
    externalId: target.id,
    kind: "playlist",
    title: playlist.snippet?.title ?? target.id,
    channelTitle: playlist.snippet?.channelTitle ?? null,
    durationSeconds: videos.reduce((total, v) => total + v.durationSeconds, 0),
    itemCount: videos.length,
    chapterCount: 0,
    videos,
  };
}

/** "PT1H2M3S" -> 3723. Throws rather than guessing, since duration drives the whole plan. */
export function parseIsoDuration(value: string | undefined) {
  const match = /^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(value ?? "");
  if (!match) throw new Error(`youtube: unreadable duration ${value}`);
  const [, d, h, m, s] = match;
  return (
    Number(d ?? 0) * 86400 + Number(h ?? 0) * 3600 + Number(m ?? 0) * 60 + Number(s ?? 0)
  );
}

/** YouTube only shows creator chapters when the description has 3+ timestamps starting at 0:00. */
export function countChapters(description: string) {
  const stamps = description
    .split("\n")
    .filter((line) => /^\s*(?:\d{1,2}:)?\d{1,2}:\d{2}(?!\d)/.test(line));
  return stamps.length >= 3 ? stamps.length : 0;
}

function mockSource(target: Target): SourceMeta {
  // popularCourses[1] is the one entry with a full hand-written lesson list, so an
  // unrecognised link mocks as that course and the rest of the pipeline has real data.
  const known = popularCourses.find((c) => c.youtubeId === target.id);
  const base = known ?? popularCourses[1]!;

  if (target.kind === "video") {
    return {
      externalId: target.id,
      kind: "video",
      title: base.title,
      channelTitle: base.creator,
      durationSeconds: base.minutes * 60,
      itemCount: null,
      chapterCount: 12,
      videos: [
        { externalId: target.id, title: base.title, durationSeconds: base.minutes * 60 },
      ],
    };
  }

  const videos = popularCourses.slice(0, 3).map((c) => ({
    externalId: c.youtubeId,
    title: c.title,
    durationSeconds: c.minutes * 60,
  }));
  return {
    externalId: target.id,
    kind: "playlist",
    title: `${base.creator} · sample playlist`,
    channelTitle: base.creator,
    durationSeconds: videos.reduce((total, v) => total + v.durationSeconds, 0),
    itemCount: videos.length,
    chapterCount: 0,
    videos,
  };
}
