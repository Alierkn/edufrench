import { cache } from "react";
import { sanityClient } from "@/lib/sanity.client";
import { appCopyQuery } from "@/lib/sanity.queries";

const REVALIDATE_SEC = 120;

export const getAppCopyDocument = cache(async () => {
  try {
    return await sanityClient.fetch<Record<string, unknown>>(appCopyQuery, {}, {
      next: { revalidate: REVALIDATE_SEC },
    });
  } catch {
    return null;
  }
});
