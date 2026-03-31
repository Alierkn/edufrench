import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site ayarları",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "siteName",
      title: "Site adı",
      type: "string",
      initialValue: "EduFrançais",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      title: "Kısa slogan",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "defaultSeo",
      title: "Varsayılan SEO",
      type: "seo",
    }),
    defineField({
      name: "headerNav",
      title: "Üst menü",
      type: "array",
      of: [{ type: "navItem" }],
    }),
    defineField({
      name: "footerColumns",
      title: "Footer sütunları",
      type: "array",
      of: [{ type: "footerColumn" }],
    }),
    defineField({
      name: "footerNote",
      title: "Footer alt notu",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "supportEmail",
      title: "Destek e-postası",
      type: "string",
    }),
    defineField({
      name: "announcement",
      title: "Duyuru bandı",
      type: "object",
      fields: [
        { name: "enabled", title: "Aktif", type: "boolean", initialValue: false },
        { name: "message", title: "Mesaj", type: "text", rows: 2 },
        { name: "linkLabel", title: "Bağlantı etiketi", type: "string" },
        { name: "linkHref", title: "Bağlantı URL", type: "string" },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site ayarları" };
    },
  },
});
