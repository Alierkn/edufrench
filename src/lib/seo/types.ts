/** Sanity `seo` nesnesi (GROQ ile genişletilmiş görsel URL) */
export type SanitySeoFields = {
  title?: string | null;
  description?: string | null;
  ogImageUrl?: string | null;
};

export type SiteSettingsSeoPayload = {
  siteName: string | null;
  tagline?: string | null;
  logoUrl?: string | null;
  defaultSeo?: SanitySeoFields | null;
};

export type LegalPagePayload = {
  title: string;
  slug: string;
  seo?: SanitySeoFields | null;
  body?: unknown[] | null;
};
