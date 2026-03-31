import { defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    { name: "title", title: "Sayfa başlığı (meta)", type: "string" },
    { name: "description", title: "Meta açıklama", type: "text", rows: 3 },
    {
      name: "ogImage",
      title: "Open Graph görseli",
      type: "image",
      options: { hotspot: true },
    },
  ],
});
