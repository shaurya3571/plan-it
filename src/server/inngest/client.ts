import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "plan-it" });

export const BUILD_REQUESTED = "course/build.requested";

export type BuildRequested = {
  buildJobId: string;
  /** the pace chosen on the form, snapshotted into the builder's enrollment */
  minutesPerDay: number;
};
