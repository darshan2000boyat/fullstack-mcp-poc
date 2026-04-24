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
    // Local Strapi media frequently runs on localhost during development.
    // Disable optimization in non-production so Next serves those URLs directly
    // instead of rejecting them through the optimizer.
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/**",
      },
      new URL("https://picsum.photos/**"),
      {
        protocol: "https",
        hostname: "*.1020dev.com",
      },
      {
        protocol: "https",
        hostname: "*.juicer.io",
      },
    ],
  },
  async redirects() {
    return redirectList;
  },
};

export default nextConfig;
