/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  env: {
    NEXT_PUBLIC_BASE_URL_API: process.env.NEXT_PUBLIC_BASE_URL_API,
    BASE_URL_API: process.env.BASE_URL_API,
  },
};

export default nextConfig;
