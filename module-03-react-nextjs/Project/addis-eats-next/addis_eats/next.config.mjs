/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve AVIF first (25-35% smaller than WebP), fall back to WebP.
    formats: ["image/avif", "image/webp"],
    // Cache optimised images for 1 year.
    minimumCacheTTL: 31536000,
    qualities: [75, 85],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 64, 128, 256, 384, 640],
  },
};

export default nextConfig;
