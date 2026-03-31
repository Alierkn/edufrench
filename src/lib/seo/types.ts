/** Sanity `seo` nesnesi (GROQ ile genişletilmiş görsel URL) */
export type SanitySeoFields = {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  ogImageUrl?: string | null;
};

/** siteSettings içindeki navItem / footerColumn (GROQ ham) */
export type SanityNavItem = {
  label?: string | null;
  href?: string | null;
  openInNewTab?: boolean | null;
};

export type SanityFooterColumn = {
  heading?: string | null;
  links?: SanityNavItem[] | null;
};

export type SiteSettingsSeoPayload = {
  siteName: string | null;
  tagline?: string | null;
  logoUrl?: string | null;
  defaultSeo?: SanitySeoFields | null;
  headerNav?: SanityNavItem[] | null;
  footerColumns?: SanityFooterColumn[] | null;
  footerNote?: string | null;
  supportEmail?: string | null;
};

export type LegalPagePayload = {
  title: string;
  slug: string;
  seo?: SanitySeoFields | null;
  body?: unknown[] | null;
};
