import type { MetadataRoute } from "next";

import { canonicalUrl, personImageUrl } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: canonicalUrl,
      changeFrequency: "monthly",
      priority: 1,
      images: [personImageUrl],
    },
  ];
}
