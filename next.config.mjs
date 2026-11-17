/** @type {import('next').NextConfig} */
// NEXT_DIST_DIR lets `npm run check` build into its own folder so it can never corrupt a running `next dev`.
const nextConfig = { reactStrictMode: true, distDir: process.env.NEXT_DIST_DIR || ".next" };
export default nextConfig;
