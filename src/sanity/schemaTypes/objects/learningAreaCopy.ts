import { defineField, defineType } from "sanity";

const MODULE_TYPES = [
  { title: "CE (Okuma)", value: "CE" },
  { title: "CO (Dinleme)", value: "CO" },
  { title: "PE (Yazma)", value: "PE" },
  { title: "PO (Konuşma)", value: "PO" },
  { title: "Grammaire", value: "Grammaire" },
  { title: "Vocabulaire", value: "Vocabulaire" },
];

export const learningAreaCopy = defineType({
  name: "learningAreaCopy",
  title: "Öğrenme alanı metinleri",
  type: "object",
  fields: [
    defineField({
      name: "moduleType",
      title: "Modül tipi",
      type: "string",
      options: { list: [...MODULE_TYPES], layout: "dropdown" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shortLabel",
      title: "Kısa etiket (rozet)",
      type: "string",
      description: "Örn. CE (Okuma)",
    }),
    defineField({
      name: "emptyStateTitle",
      title: "İçerik yok başlığı",
      type: "string",
    }),
    defineField({
      name: "emptyStateBody",
      title: "İçerik yok açıklaması",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "loadingMessage",
      title: "Yükleniyor metni",
      type: "string",
    }),
    defineField({
      name: "dashboardCardTitle",
      title: "Dashboard kart başlığı",
      type: "string",
    }),
  ],
  preview: {
    select: { mt: "moduleType", short: "shortLabel" },
    prepare({ mt, short }) {
      return { title: mt || "Modül", subtitle: short };
    },
  },
});
