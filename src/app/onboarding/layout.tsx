import type { Metadata } from "next";

export const metadata = {
  title: "Profil kurulumu",
  robots: { index: false, follow: false },
} satisfies Metadata;

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
