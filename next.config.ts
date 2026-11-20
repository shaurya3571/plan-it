import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Off: this is a static frontend on mock data, and the strict mode forces
  // Suspense boundaries around usePathname() in the app shell for no gain.
  cacheComponents: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  partialPrefetching: false, // requires cacheComponents
  reactCompiler: true,

};

export default nextConfig;
