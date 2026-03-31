"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Vercel Analytics + Speed Insights. Ortamda Vercel deploy yoksa zararsız no-op davranışa yakın çalışır.
 */
export function WebAnalytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
