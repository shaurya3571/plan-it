import postgres from "postgres";
import {
  courseDetails,
  popularCourses,
  type Course,
  type Lesson,
} from "../src/content/courses.ts";

/**
 * Loads the hand-written course list into Postgres, so the course pages - which
 * now read the database - have something to show without building a course first.
 *
 * src/content/courses.ts stays the place this content is authored; this script
 * only derives rows from it. Re-running is safe: every statement is an upsert or
 * a delete-then-insert.
 *
 * Raw SQL rather than Drizzle because the schema modules use directory imports
 * that plain Node cannot resolve, and adding a TypeScript runner for one script
 * is not worth it.
 */

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Run with: npm run db:seed");
  process.exit(1);
}

const sql = postgres(connectionString, { prepare: false });

type LessonRow = {
  course_id: string;
  n: number;
  title: string;
  summary: string;
  start_seconds: number;
  end_seconds: number;
  minutes: number;
  video_external_id: string;
  status: string;
};

/**
 * Only one entry in src/content/courses.ts carries a real lesson list. The rest get
 * evenly split placeholders so every card on the landing page and /community opens
 * instead of 404ing. Building one of these for real replaces them with written lessons.
 */
function placeholderLessons(course: Course): Lesson[] {
  const count = Math.max(1, course.lessonCount);
  const even = Math.floor(course.minutes / count);
  // hand the leftover minutes to the first lessons so the parts still add up to the course
  let spare = course.minutes - even * count;

  return Array.from({ length: count }, (_, i) => {
    const extra = spare > 0 ? 1 : 0;
    spare -= extra;
    return {
      n: i + 1,
      title: `Part ${i + 1}`,
      summary: "Placeholder from the seed. Build this course to get written lessons.",
      minutes: Math.max(1, even + extra),
    };
  });
}

async function seed() {
  let courseCount = 0;
  let lessonCount = 0;

  for (const course of popularCourses) {
    const [source] = await sql<{ id: string }[]>`
      insert into video_sources
        (provider, external_id, kind, title, channel_title, duration_seconds, chapter_count)
      values
        ('youtube', ${course.youtubeId}, 'video', ${course.title}, ${course.creator},
         ${course.minutes * 60}, 0)
      on conflict (provider, external_id) do update set
        title = excluded.title,
        channel_title = excluded.channel_title,
        duration_seconds = excluded.duration_seconds,
        fetched_at = now()
      returning id
    `;

    const [row] = await sql<{ id: string }[]>`
      insert into courses
        (slug, source_id, title, creator, total_minutes, lesson_count,
         visibility, build_status, learners_count, published_at)
      values
        (${course.slug}, ${source!.id}, ${course.title}, ${course.creator},
         ${course.minutes}, ${course.lessonCount}, 'public', 'ready',
         ${course.learning}, now())
      on conflict (slug) do update set
        title = excluded.title,
        creator = excluded.creator,
        total_minutes = excluded.total_minutes,
        lesson_count = excluded.lesson_count,
        learners_count = excluded.learners_count,
        build_status = 'ready'
      returning id
    `;
    courseCount += 1;

    const detail = courseDetails[course.slug];
    const plan = detail
      ? detail.days.flatMap((day) => day.lessons)
      : placeholderLessons(course);

    // Lesson times are not in the content, so they are laid end to end from the
    // lesson lengths, which is how the hand-written data was built.
    let at = 0;
    const rows: LessonRow[] = plan.map((lesson) => {
      const startSeconds = at;
      at += lesson.minutes * 60;
      return {
        course_id: row!.id,
        n: lesson.n,
        title: lesson.title,
        summary: lesson.summary,
        start_seconds: startSeconds,
        end_seconds: at,
        minutes: lesson.minutes,
        video_external_id: course.youtubeId,
        status: "ready",
      };
    });

    // cascades to note blocks and quizzes, so a re-seed cannot leave orphans
    await sql`delete from lessons where course_id = ${row!.id}`;
    await sql`insert into lessons ${sql(rows)}`;
    lessonCount += rows.length;
    console.log(
      `  ${course.slug} - ${rows.length} lessons${detail ? "" : " (placeholder)"}`,
    );
  }

  console.log(`\nSeeded ${courseCount} courses and ${lessonCount} lessons.`);
}

try {
  await seed();
} catch (error) {
  console.error("\nSeed failed:", error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
