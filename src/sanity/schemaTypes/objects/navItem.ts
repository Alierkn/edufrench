import { defineType } from "sanity";

export const navItem = defineType({
  name: "navItem",
  title: "Menü öğesi",
  type: "object",
  fields: [
    { name: "label", title: "Etiket", type: "string", validation: (r) => r.required() },
    { name: "href", title: "Bağlantı (örn. /dashboard)", type: "string", validation: (r) => r.required() },
    { name: "openInNewTab", title: "Yeni sekmede aç", type: "boolean", initialValue: false },
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
