import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity.client";
import { appCopyQuery, siteSettingsQuery } from "@/lib/sanity.queries";

/**
 * Genel site metinleri ve ayarlar (Studio’dan). İstemci sayfaları cache’lenebilir.
 */
export async function GET() {
  try {
    const [siteSettings, appCopy] = await Promise.all([
      sanityClient.fetch(siteSettingsQuery),
      sanityClient.fetch(appCopyQuery),
    ]);
    return NextResponse.json({ siteSettings, appCopy });
  } catch (e) {
    console.error("site-bundle:", e);
    return NextResponse.json(
      { siteSettings: null, appCopy: null, error: "CMS okunamadı" },
      { status: 200 }
    );
  }
}
