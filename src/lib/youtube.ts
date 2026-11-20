/** Parsed shape of a pasted YouTube link. */
export type YoutubeTarget =
  | { kind: "video"; id: string }
  | { kind: "playlist"; id: string }
  | null;

const HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

const ID = /^[\w-]{11}$/;
const LIST_ID = /^[\w-]{12,42}$/;

/**
 * Accepts the shapes people actually paste: watch?v=, youtu.be/, /shorts/,
 * /embed/ and playlist?list=. A playlist link wins over the video it opens on,
 * because "build the playlist" is what someone pasting it means.
 */
export function parseYoutubeUrl(input: string): YoutubeTarget {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }
  if (!HOSTS.has(url.hostname)) return null;

  const list = url.searchParams.get("list");
  if (list && LIST_ID.test(list)) return { kind: "playlist", id: list };

  const v = url.searchParams.get("v");
  if (v && ID.test(v)) return { kind: "video", id: v };

  const segments = url.pathname.split("/").filter(Boolean);
  if (url.hostname.endsWith("youtu.be") && segments[0] && ID.test(segments[0])) {
    return { kind: "video", id: segments[0] };
  }
  if (
    (segments[0] === "shorts" || segments[0] === "embed" || segments[0] === "live") &&
    segments[1] &&
    ID.test(segments[1])
  ) {
    return { kind: "video", id: segments[1] };
  }

  return null;
}
