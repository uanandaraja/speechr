import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import lokalTunnel from "lokal-webpack-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.plugins.push(
        new lokalTunnel({
          lanAddress: "next.local",
          publicAddress: "next.i.lokal-so.site", // Optional: custom public address
        }),
      );
    }
    return config;
  },
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
