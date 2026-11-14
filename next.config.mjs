/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Don't let browsers guess content types.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send only the origin to other sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site is never meant to be framed (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // No access to powerful features the site doesn't use.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // Isolate the browsing context from cross-origin popups.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" }
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // The root layout lives under app/[lang], so a layout-based not-found
    // can't be server-rendered for unmatched URLs. global-not-found.jsx is
    // Next's documented solution for that setup. See docs/ARCHITECTURE.md.
    globalNotFound: true
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  }
};

export default nextConfig;
