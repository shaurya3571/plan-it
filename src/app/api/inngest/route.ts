import { serve } from "inngest/next";
import { buildCourse } from "@/server/inngest/build-course";
import { inngest } from "@/server/inngest/client";

/**
 * A build runs for minutes, so the route needs the longest window the host
 * allows. No `runtime` export: the edge runtime is deprecated in Next 16 and
 * the pipeline needs Node anyway for the Postgres driver.
 */
export const maxDuration = 300;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [buildCourse],
});
