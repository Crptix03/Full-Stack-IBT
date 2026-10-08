/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve AVIF first (25-35% smaller than WebP), fall back to WebP.
    // Both are generated on-demand and cached by Next.js image optimizer.
    formats: ["image/avif", "image/webp"],
    // Cache optimised images for 1 year so Lighthouse cold-start runs
    // don't re-encode the LCP image from scratch.
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
