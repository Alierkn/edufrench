import type { Metadata } from "next";

export const metadata = {
  title: "Kayıt",
  robots: { index: false, follow: false },
} satisfies Metadata;

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
