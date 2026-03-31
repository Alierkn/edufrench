import { defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons";

/**
 * Grammaire kataloğunda gösterilen öne çıkan konular (statik liste yerine CMS).
 * Uygulama `key` ile eşleştirir.
 */
export const grammarSpotlight = defineType({
  name: "grammarSpotlight",
  title: "Grammaire vitrin konusu",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "key",
      title: "Sabit anahtar",
      type: "slug",
      description: "Örn. pronoms, subjonctif — kodda kullanılır",
      options: { source: "title", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Başlık",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "level",
      title: "Seviye",
      type: "string",
      options: {
        list: ["A1", "A2", "B1", "B2"].map((v) => ({ title: v, value: v })),
      },
    }),
    defineField({
      name: "summary",
      title: "Liste özeti",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "theoryIntro",
      title: "Teori giriş metni",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "hasExercise",
      title: "Örnek alıştırma var",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "exercisePlaceholderMessage",
      title: "Alıştırma yok mesajı",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "sortOrder",
      title: "Sıra",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Yayında",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "linkedModule",
      title: "Bağlı akademik modül (opsiyonel)",
      type: "reference",
      to: [{ type: "eduModule" }],
    }),
  ],
  preview: {
    select: { title: "title", level: "level", active: "isActive" },
    prepare({ title, level, active }) {
      return {
        title,
        subtitle: `${level || "?"}${active === false ? " (kapalı)" : ""}`,
      };
    },
  },
  orderings: [
    { title: "Sıra", name: "sortOrderAsc", by: [{ field: "sortOrder", direction: "asc" }] },
  ],
});
