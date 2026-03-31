import { defineField, defineType } from "sanity";

export const footerColumn = defineType({
  name: "footerColumn",
  title: "Footer sütunu",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Sütun başlığı", type: "string" }),
    defineField({
      name: "links",
      title: "Bağlantılar",
      type: "array",
      of: [{ type: "navItem" }],
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
