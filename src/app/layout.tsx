import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "EduFrançais",
  description: "Fransız Liselerine Özel Akademik Modül Sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${playfair.variable} antialiased selection:bg-[var(--color-neo-yellow)] selection:text-[var(--color-neo-border)]`}>
        <AuthProvider>
           {children}
        </AuthProvider>
      </body>
    </html>
  );
}
