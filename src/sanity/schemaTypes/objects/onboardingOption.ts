import { defineType } from "sanity";

/** Onboarding adımındaki tek seçenek (uygulama `value` ile eşleştirir) */
export const onboardingOption = defineType({
  name: "onboardingOption",
  title: "Onboarding seçeneği",
  type: "object",
  fields: [
    { name: "label", title: "Görünen metin", type: "string", validation: (r) => r.required() },
    {
      name: "value",
      title: "Değer (kod)",
      type: "string",
      description: "API/Prisma ile aynı olmalı: örn. 9, sjb, Grammaire, friend",
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
  },
});
