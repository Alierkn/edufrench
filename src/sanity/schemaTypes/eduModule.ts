import { defineField, defineType } from "sanity";

export const eduModule = defineType({
  name: "eduModule",
  title: "Akademik modül",
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
      name: "moduleType",
      title: "Modül tipi",
      type: "string",
      options: {
        list: [
          { title: "CE (Okuma)", value: "CE" },
          { title: "CO (Dinleme)", value: "CO" },
          { title: "PE (Yazma)", value: "PE" },
          { title: "PO (Konuşma)", value: "PO" },
          { title: "Grammaire", value: "Grammaire" },
          { title: "Vocabulaire", value: "Vocabulaire" },
        ],
        layout: "dropdown",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "level",
      title: "Dil seviyesi",
      type: "string",
      options: {
        list: [
          { title: "A1", value: "A1" },
          { title: "A2", value: "A2" },
          { title: "B1", value: "B1" },
          { title: "B2", value: "B2" },
        ],
      },
    }),
    defineField({
      name: "description",
      title: "Açıklama",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "targetGrades",
      title: "Hedef sınıflar (boş = tümü)",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "9", value: "9" },
          { title: "10", value: "10" },
          { title: "11", value: "11" },
          { title: "12", value: "12" },
        ],
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
      name: "isActive",
      title: "Yayında",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "exercises",
      title: "Egzersizler",
      type: "array",
      of: [{ type: "reference", to: [{ type: "eduExercise" }] }],
    }),
  ],
  preview: {
    select: { title: "title", mt: "moduleType", active: "isActive" },
    prepare({ title, mt, active }) {
      return {
        title,
        subtitle: `${mt || "?"}${active === false ? " (taslak)" : ""}`,
      };
    },
  },
});
