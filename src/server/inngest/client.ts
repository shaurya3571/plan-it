import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "plan-it",
  // The SDK defaults to cloud mode, which refuses to register without a signing
  // key. Deriving this from NODE_ENV means `next dev` talks to the local dev
  // server with no extra setup, while a real deployment still requires the keys.
  isDev: process.env.NODE_ENV !== "production",
});

export const BUILD_REQUESTED = "course/build.requested";

export type BuildRequested = {
  buildJobId: string;
  /** the pace chosen on the form, snapshotted into the builder's enrollment */
  minutesPerDay: number;
};
