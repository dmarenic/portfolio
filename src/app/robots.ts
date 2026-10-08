import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

// Served as /robots.txt: every page may be indexed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
