import fs from "fs";
import path from "path";
import redirectList from "./next.rewrites.mjs";

// const redirectList = require("./redirects");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Cache Components for explicit opt-in caching
  cacheComponents: true,
  // Uncomment the following line if docker images are used
  // output:"standalone",
  generateBuildId: async () => {
    let buildId = process.env.BUILD_ID;
    try {
      const buildIdPath = path.join("BUILD_ID");
      if (fs.existsSync(buildIdPath)) {
        buildId = fs.readFileSync(buildIdPath, "utf8").trim();
        console.log("BUILD_ID:", buildId);
      }
    } catch (err) {
      console.warn("Could not read BUILD_ID:", err.message);
    }

    return buildId;
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "*.1020dev.com",
      },
      {
        protocol: "https",
        hostname: "*.juicer.io",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  async redirects() {
    return redirectList;
  },
};

export default nextConfig;
