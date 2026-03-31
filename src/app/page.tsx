import type { Metadata } from "next";
import { getAppCopyDocument } from "@/lib/getAppCopyCached";
import { getLegalPagesNav } from "@/lib/getLegalPagesNav";
import { buildHomeCopy } from "@/lib/homeCopy";
import { buildHomeFooterData } from "@/lib/homeFooter";
import { getSiteSettingsForSeo } from "@/lib/seo/fetchSiteSeo";
import { pageMetadataFromSanitySeo } from "@/lib/seo/mapSanitySeo";
import { mergeSanitySeo } from "@/lib/seo/mergeSanitySeo";
import type { SanitySeoFields } from "@/lib/seo/types";
import HomeClient from "./HomeClient";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, appCopy] = await Promise.all([
    getSiteSettingsForSeo(),
    getAppCopyDocument(),
  ]);
  const homeSeo = appCopy?.homeSeo as SanitySeoFields | null | undefined;
  const merged = mergeSanitySeo(settings?.defaultSeo, homeSeo);
  return pageMetadataFromSanitySeo(merged, {
    path: "/",
    siteName: settings?.siteName,
    fallbackTitle: settings?.siteName || "EduFrançais",
    fallbackDescription: settings?.tagline || undefined,
  });
}

export default async function Home() {
  const [appCopy, settings, legalNav] = await Promise.all([
    getAppCopyDocument(),
    getSiteSettingsForSeo(),
    getLegalPagesNav(),
  ]);
  const home = buildHomeCopy(appCopy as Parameters<typeof buildHomeCopy>[0]);
  const footer = buildHomeFooterData(settings, legalNav);
  const siteName = settings?.siteName?.trim() || "EduFrancais";

  return <HomeClient {...home} siteName={siteName} footer={footer} />;
}
