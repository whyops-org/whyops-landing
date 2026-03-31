/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.hashnode.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.s3.us-east-1.amazonaws.com' },
      { protocol: 'https', hostname: '*.s3.amazonaws.com' },
    ],
  },
};

export default nextConfig;
