import { cache } from "react";
import { sanityClient } from "@/lib/sanity.client";
import { siteSettingsQuery } from "@/lib/sanity.queries";
import type { SiteSettingsSeoPayload } from "@/lib/seo/types";

const REVALIDATE_SEC = 120;

export const getSiteSettingsForSeo = cache(async (): Promise<SiteSettingsSeoPayload | null> => {
  try {
    const doc = await sanityClient.fetch<SiteSettingsSeoPayload | null>(
      siteSettingsQuery,
      {},
      { next: { revalidate: REVALIDATE_SEC } }
    );
    return doc;
  } catch {
    return null;
  }
});
