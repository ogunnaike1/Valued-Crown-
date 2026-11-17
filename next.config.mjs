/** @type {import('next').NextConfig} */
// NEXT_DIST_DIR lets `npm run check` build into its own folder so it can never corrupt a running `next dev`.
const nextConfig = { reactStrictMode: true, distDir: process.env.NEXT_DIST_DIR || ".next",
  // old product URL, kept so existing links keep working
  async redirects() { return [{ source: "/products/retail-manager", destination: "/products/shop-manager", permanent: true }]; },
};
export default nextConfig;
