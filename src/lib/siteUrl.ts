import { getAppBaseUrl } from "@/lib/appBaseUrl";

/**
 * Kamuya açık kanonik site kökü (metadata, OG URL, sitemap).
 * Üretimde `NEXT_PUBLIC_SITE_URL=https://www.ornek.com` tanımlayın.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return getAppBaseUrl();
}
