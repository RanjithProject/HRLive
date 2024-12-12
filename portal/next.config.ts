// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//    env: { APIS: process.env.APIS ||"https://hrprojectlive-server.onrender.com/", }

// };

// export default nextConfig;



import { NextConfig } from 'next';
const nextConfig: NextConfig = {
  reactStrictMode: true,
    env: {
    APIS: process.env.APIS || 'https://hrprojectlive-server.onrender.com/',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.APIS}/api/:path*`,       },
    ];
  },
};
export default nextConfig;
