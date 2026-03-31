import type { Metadata, Viewport } from "next";
import { metadata as studioMetadata } from "next-sanity/studio";

export const metadata = {
  ...studioMetadata,
  title: "EduFrancais Studio",
  robots: { index: false, follow: false },
} satisfies Metadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
