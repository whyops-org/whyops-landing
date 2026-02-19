import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: [
        "https://whyops.com/sitemap.xml",
        "https://whyops.com/docs/sitemap.xml",
      ],
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [
      "https://whyops.com/sitemap.xml",
      "https://whyops.com/docs/sitemap.xml",
    ],
  };
}
