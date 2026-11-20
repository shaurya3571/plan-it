import { integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const videoSources = pgTable(
  "video_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: text("provider").notNull().default("youtube"),
    externalId: text("external_id").notNull(),
    kind: text("kind").notNull(), // 'video' | 'playlist'
    title: text("title").notNull(),
    channelTitle: text("channel_title"),
    durationSeconds: integer("duration_seconds").notNull(),
    itemCount: integer("item_count"),
    chapterCount: integer("chapter_count").notNull().default(0), // the demo's "CREATOR CHAPTERS"
    rawMeta: jsonb("raw_meta"), // small, cached YouTube Data API response
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("video_sources_provider_external_id").on(t.provider, t.externalId)],
);
