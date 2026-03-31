import type { Metadata } from "next";

export const metadata = {
  title: "Giriş",
  robots: { index: false, follow: false },
} satisfies Metadata;

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
