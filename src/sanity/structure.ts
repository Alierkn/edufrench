import type { StructureResolver } from "sanity/structure";

const SINGLETONS: { schema: string; id: string; title: string }[] = [
  { schema: "siteSettings", id: "siteSettings", title: "Site ayarları" },
  { schema: "appCopy", id: "appCopy", title: "Uygulama metinleri" },
];

export const structure: StructureResolver = (S) => {
  const singletonIds = new Set(SINGLETONS.map((s) => s.schema));

  const singletonItems = SINGLETONS.map(({ schema, id, title }) =>
    S.listItem()
      .title(title)
      .id(id)
      .child(S.document().schemaType(schema).documentId(id).title(title))
  );

  return S.list()
    .title("EduFrançais")
    .items([
      ...singletonItems,
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const sid = item.getId();
        return typeof sid === "string" ? !singletonIds.has(sid) : true;
      }),
    ]);
};
