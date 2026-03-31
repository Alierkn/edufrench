import { defineField, defineType } from "sanity";

export const eduExercise = defineType({
  name: "eduExercise",
  title: "Egzersiz",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Başlık",
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
      name: "exerciseType",
      title: "Soru tipi",
      type: "string",
      options: {
        list: [
          { title: "MCQ (Çoktan seçmeli)", value: "MCQ" },
          { title: "Boşluk doldurma (Cloze)", value: "FILL" },
          { title: "Serbest metin", value: "TEXT" },
          { title: "Ses kaydı", value: "RECORDING" },
        ],
        layout: "radio",
      },
      initialValue: "MCQ",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "content",
      title: "Metin / bağlam / transcript",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "media",
      title: "Ses veya görsel",
      type: "file",
      options: { accept: "audio/*,image/*" },
    }),
    defineField({
      name: "options",
      title: "Şıklar (MCQ)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "text", title: "Metin", type: "string" },
            { name: "isCorrect", title: "Doğru cevap", type: "boolean", initialValue: false },
          ],
          preview: {
            select: { text: "text", ok: "isCorrect" },
            prepare({ text, ok }) {
              return { title: text || "Şık", subtitle: ok ? "Doğru" : "" };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", t: "exerciseType" },
    prepare({ title, t }) {
      return { title, subtitle: t };
    },
  },
});
