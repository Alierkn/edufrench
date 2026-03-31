import type { Metadata } from "next";
import type { SanitySeoFields } from "@/lib/seo/types";
import type { SiteSettingsSeoPayload } from "@/lib/seo/types";
import { getSiteUrl } from "@/lib/siteUrl";

const DEFAULT_TITLE = "EduFrançais";
const DEFAULT_DESCRIPTION =
  "Fransız liselerine özel CE, CO, PE, PO, grammaire ve vocabulaire modülleri.";

export function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const base = getSiteUrl();
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

type PageSeoOptions = {
  path: string;
  siteName?: string | null;
  fallbackTitle?: string;
  fallbackDescription?: string;
};

/**
 * Tek sayfa: canonical + tam OG/Twitter (ana sayfa, yasal sayfa, …).
 */
export function pageMetadataFromSanitySeo(
  seo: SanitySeoFields | null | undefined,
  opts: PageSeoOptions
): Metadata {
  const site = (opts.siteName?.trim() || DEFAULT_TITLE).replace(/\s+/g, " ");
  const title = seo?.title?.trim() || opts.fallbackTitle?.trim() || site;
  const description =
    seo?.description?.trim() ||
    opts.fallbackDescription?.trim() ||
    DEFAULT_DESCRIPTION;

  const canonical = absoluteUrl(opts.path);
  const ogImages =
    seo?.ogImageUrl && seo.ogImageUrl.length > 0
      ? [{ url: seo.ogImageUrl, width: 1200, height: 630, alt: title }]
      : [];

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site,
      locale: "tr_TR",
      type: "website",
      ...(ogImages.length ? { images: ogImages } : {}),
    },
    twitter: {
      card: ogImages.length ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImages.length ? { images: [ogImages[0].url] } : {}),
    },
  };
}

/**
 * Kök layout: metadataBase, şablon, site geneli açıklama/OG görseli — canonical yok.
 */
export function globalMetadataFromSiteSettings(
  settings: SiteSettingsSeoPayload | null
): Metadata {
  const site = settings?.siteName?.trim() || DEFAULT_TITLE;
  const base = getSiteUrl();
  const seo = settings?.defaultSeo;
  const description =
    seo?.description?.trim() || settings?.tagline?.trim() || DEFAULT_DESCRIPTION;
  const ogImages =
    seo?.ogImageUrl && seo.ogImageUrl.length > 0
      ? [{ url: seo.ogImageUrl, width: 1200, height: 630, alt: site }]
      : [];

  return {
    metadataBase: new URL(base),
    title: {
      default: seo?.title?.trim() || site,
      template: `%s | ${site}`,
    },
    description,
    applicationName: site,
    referrer: "origin-when-cross-origin",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: site,
      description,
      ...(ogImages.length ? { images: ogImages } : {}),
    },
    twitter: {
      card: ogImages.length ? "summary_large_image" : "summary",
      description,
      ...(ogImages.length ? { images: [ogImages[0].url] } : {}),
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}
