import { defineType } from "sanity";

/** Basit zengin metin (hukuki sayfalar, uzun açıklamalar) */
export const blockContent = defineType({
  name: "blockContent",
  title: "Zengin metin",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Alıntı", value: "blockquote" },
      ],
      lists: [
        { title: "Madde işaretli", value: "bullet" },
        { title: "Numaralı", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Kalın", value: "strong" },
          { title: "İtalik", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Bağlantı",
            fields: [
              { name: "href", type: "url", title: "URL", validation: (r) => r.uri({ allowRelative: true }) },
            ],
          },
        ],
      },
    },
  ],
});
