import type { SiteSettingsSeoPayload, SanityNavItem } from "@/lib/seo/types";
import type { LegalPageNavRow } from "@/lib/getLegalPagesNav";

export type HomeFooterLink = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type HomeFooterColumn = {
  heading: string;
  links: HomeFooterLink[];
};

export type HomeFooterData = {
  columns: HomeFooterColumn[];
  note: string | null;
  supportEmail: string | null;
};

function normalizeNavHref(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return t.startsWith("/") ? t : `/${t}`;
}

function navItemToLink(item: SanityNavItem): HomeFooterLink | null {
  const label = item.label?.trim();
  const href = normalizeNavHref(item.href ?? "");
  if (!label || !href) return null;
  return {
    label,
    href,
    openInNewTab: Boolean(item.openInNewTab),
  };
}

/**
 * CMS footerColumns + otomatik “Yasal” sütunu (CMS’te aynı href yoksa).
 */
export function buildHomeFooterData(
  settings: SiteSettingsSeoPayload | null,
  legalPages: LegalPageNavRow[]
): HomeFooterData {
  const cmsHrefs = new Set<string>();
  const columns: HomeFooterColumn[] = [];

  for (const col of settings?.footerColumns ?? []) {
    const links = (col.links ?? [])
      .map(navItemToLink)
      .filter((x): x is HomeFooterLink => x !== null);
    for (const l of links) {
      cmsHrefs.add(l.href.replace(/\/$/, "") || l.href);
    }
    const heading = col.heading?.trim() || "Bağlantılar";
    if (links.length === 0) continue;
    columns.push({ heading, links });
  }

  const legalLinks: HomeFooterLink[] = [];
  for (const p of legalPages) {
    const href = `/legal/${p.slug.replace(/^\/+/, "")}`;
    const key = href.replace(/\/$/, "");
    if (cmsHrefs.has(key)) continue;
    legalLinks.push({ label: p.title.trim(), href, openInNewTab: false });
    cmsHrefs.add(key);
  }
  if (legalLinks.length > 0) {
    columns.push({ heading: "Yasal", links: legalLinks });
  }

  return {
    columns,
    note: settings?.footerNote?.trim() || null,
    supportEmail: settings?.supportEmail?.trim() || null,
  };
}
