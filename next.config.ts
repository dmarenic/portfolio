import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is generated as static HTML at build time, so Cache Components
  // (partial prerendering and the `use cache` directive) are not needed here.
  // Leaving them off also keeps `dynamicParams = false` available, which turns
  // any unknown locale in the URL into a 404.
  cacheComponents: false,

  // Do not generate AGENTS.md (instructions for AI coding tools) on `next dev`.
  agentRules: false,
};

export default nextConfig;
