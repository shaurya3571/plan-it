import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "../db";
import { profiles } from "../db/schema";
import { createClient } from "./server";

/**
 * The only path to a user id in server code. Calls getUser(), which verifies
 * the JWT against Supabase - never getSession(), which only decodes the cookie.
 */
export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return data.user;
}

/** The signed-in user plus their profiles row, for display (name, streak, pace). */
export async function requireProfile() {
  const user = await requireUser();
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, user.id));

  return {
    user,
    // Falls back if the signup trigger hasn't run yet or the provider gave no name.
    displayName: profile?.displayName ?? user.email?.split("@")[0] ?? "there",
    minutesPerDay: profile?.minutesPerDay ?? 90,
    streakCount: profile?.streakCount ?? 0,
  };
}
