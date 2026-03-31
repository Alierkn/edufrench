import { cache } from "react";
import { sanityClient } from "@/lib/sanity.client";
import { legalPagesNavQuery } from "@/lib/sanity.queries";

const REVALIDATE_SEC = 120;

export type LegalPageNavRow = { title: string; slug: string };

/**
 * Ana sayfa footer’da /legal/[slug] linkleri için (Sanity yoksa []).
 */
export const getLegalPagesNav = cache(async (): Promise<LegalPageNavRow[]> => {
  try {
    const rows = await sanityClient.fetch<LegalPageNavRow[] | null>(
      legalPagesNavQuery,
      {},
      { next: { revalidate: REVALIDATE_SEC } }
    );
    if (!Array.isArray(rows)) return [];
    return rows.filter((r) => typeof r.slug === "string" && r.slug && typeof r.title === "string" && r.title);
  } catch {
    return [];
  }
});
