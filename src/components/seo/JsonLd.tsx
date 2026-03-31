import { getSiteUrl } from "@/lib/siteUrl";

type JsonLdProps = {
  siteName: string;
  description?: string;
  logoUrl?: string | null;
};

/**
 * Organization + WebSite şeması (Google zengin sonuç uyumluluğu).
 */
export function JsonLd({ siteName, description, logoUrl }: JsonLdProps) {
  const url = getSiteUrl();
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url,
    ...(description ? { description } : {}),
    ...(logoUrl ? { logo: logoUrl } : {}),
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url,
    publisher: { "@type": "Organization", name: siteName },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
