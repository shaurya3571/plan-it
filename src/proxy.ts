import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// (shell) routes - see src/app/(shell)/layout.tsx. Route groups don't appear in the URL.
const PROTECTED_PREFIXES = ["/dashboard", "/new", "/community", "/courses", "/learn", "/build"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refreshes the session (if needed) before any Server Component reads it.
  const { data } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );
  if (isProtected && !data.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Framework and API paths are excluded wholesale. Matching only _next/static and
  // _next/image left every other /_next request - including the dev server's hot
  // reload channel - running a Supabase getUser() round trip, which is both wasted
  // work and enough to break hot reload. Page navigations and their RSC prefetches
  // use the route's own path, so they still pass through here.
  matcher: [
    "/((?!api|_next|__nextjs|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
