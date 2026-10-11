import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is generated as static HTML at build time, so Cache Components
  // (partial prerendering and the `use cache` directive) are not needed here.
  // Leaving them off also keeps `dynamicParams = false` available, which turns
  // any unknown locale in the URL into a 404.
  cacheComponents: false,

  // Do not generate AGENTS.md (instructions for AI coding tools) on `next dev`.
  agentRules: false,

  // The chat route reads src/content/chatbot/dodatno.md while it runs (see
  // lib/chatbot/knowledge.ts). Next.js copies to the server only the files
  // it can see being imported, so this file has to be listed.
  outputFileTracingIncludes: {
    "/api/chat": ["./src/content/chatbot/**/*"],
  },

  experimental: {
    // Lets src/app/global-not-found.tsx render the 404 page for addresses that
    // match no route. It is needed because the root layout is under [locale].
    globalNotFound: true,
  },

  // English pages are built under /en (the [locale] segment), but they are
  // published without the prefix. These two lists connect the two:
  //
  // redirects: someone who opens /en/... is sent to the short URL.
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      {
        source: "/en/projects/:slug",
        destination: "/projects/:slug",
        permanent: true,
      },
    ];
  },

  // rewrites: the short URL shows the /en page without changing the address
  // bar. Only English pages are listed, so /hr/... is never rewritten.
  async rewrites() {
    return [
      { source: "/", destination: "/en" },
      { source: "/projects/:slug", destination: "/en/projects/:slug" },
    ];
  },
};

export default nextConfig;
