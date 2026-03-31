import type { SanitySeoFields } from "@/lib/seo/types";

/** Ana sayfa: `homeSeo` alanları `defaultSeo` üzerine yazar. */
export function mergeSanitySeo(
  base: SanitySeoFields | null | undefined,
  override: SanitySeoFields | null | undefined
): SanitySeoFields | null {
  if (!base && !override) return null;
  return {
    title: override?.title ?? base?.title ?? null,
    description: override?.description ?? base?.description ?? null,
    ogImageUrl: override?.ogImageUrl ?? base?.ogImageUrl ?? null,
  };
}
