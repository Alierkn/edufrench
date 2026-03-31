import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { WebAnalytics } from "@/components/seo/WebAnalytics";
import { getSiteSettingsForSeo } from "@/lib/seo/fetchSiteSeo";
import { globalMetadataFromSiteSettings } from "@/lib/seo/mapSanitySeo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsForSeo();
  return globalMetadataFromSiteSettings(settings);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettingsForSeo();
  const siteName = settings?.siteName?.trim() || "EduFrançais";
  const description =
    settings?.defaultSeo?.description?.trim() ||
    settings?.tagline?.trim() ||
    undefined;

  return (
    <html lang="tr">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased selection:bg-[var(--color-neo-yellow)] selection:text-[var(--color-neo-border)]`}
      >
        <JsonLd siteName={siteName} description={description} logoUrl={settings?.logoUrl} />
        <AuthProvider>{children}</AuthProvider>
        <WebAnalytics />
      </body>
    </html>
  );
}
