import { defineField, defineType } from "sanity";

export const vocabTopic = defineType({
  name: "vocabTopic",
  title: "Vocabulaire konusu",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Konu başlığı",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Kısa özet",
      type: "text",
      rows: 3,
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
      name: "targetGrades",
      title: "Hedef sınıflar",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: ["9", "10", "11", "12"].map((v) => ({ title: `${v}. sınıf`, value: v })),
      },
    }),
    defineField({
      name: "targetSchools",
      title: "Hedef okullar (boş = tümü)",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Saint Joseph", value: "sjb" },
          { title: "Saint Benoît", value: "sb" },
          { title: "Notre Dame de Sion", value: "nds" },
          { title: "Diğer", value: "other" },
        ],
      },
    }),
    defineField({
      name: "cards",
      title: "Flashcard'lar",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "frontFr", title: "Ön (FR)", type: "string" },
            { name: "backTr", title: "Arka (TR)", type: "string" },
            { name: "example", title: "Örnek cümle (opsiyonel)", type: "text", rows: 2 },
          ],
          preview: {
            select: { f: "frontFr", b: "backTr" },
            prepare({ f, b }) {
              return { title: f || "Kart", subtitle: b };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", level: "level" },
    prepare({ title, level }) {
      return { title, subtitle: level };
    },
  },
});
