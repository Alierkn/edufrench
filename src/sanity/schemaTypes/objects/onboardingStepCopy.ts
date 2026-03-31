import { defineField, defineType } from "sanity";

export const onboardingStepCopy = defineType({
  name: "onboardingStepCopy",
  title: "Onboarding adımı",
  type: "object",
  fields: [
    defineField({
      name: "stepNumber",
      title: "Adım no",
      type: "number",
      validation: (r) => r.required().min(1).max(10).integer(),
    }),
    defineField({ name: "title", title: "Başlık", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "Açıklama", type: "text", rows: 3 }),
    defineField({
      name: "fieldKey",
      title: "Alan anahtarı",
      type: "string",
      description: "Uygulama: grade | school | weakness | source",
      options: {
        list: [
          { title: "Sınıf (grade)", value: "grade" },
          { title: "Okul (school)", value: "school" },
          { title: "Zayıflık (weakness)", value: "weakness" },
          { title: "Kaynak (source)", value: "source" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "options",
      title: "Seçenekler",
      type: "array",
      of: [{ type: "onboardingOption" }],
    }),
  ],
  preview: {
    select: { n: "stepNumber", t: "title", fk: "fieldKey" },
    prepare({ n, t, fk }) {
      return { title: `Adım ${n}: ${t || ""}`, subtitle: fk };
    },
  },
});
