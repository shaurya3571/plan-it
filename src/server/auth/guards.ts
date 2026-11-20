import { redirect } from "next/navigation";
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
