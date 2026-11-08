/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // The root layout lives under app/[lang], so a layout-based not-found
    // can't be server-rendered for unmatched URLs. global-not-found.jsx is
    // Next's documented solution for that setup. See docs/ARCHITECTURE.md.
    globalNotFound: true
  }
};

export default nextConfig;
