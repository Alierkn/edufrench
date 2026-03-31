import type { Metadata } from "next";
import Link from "next/link";
import { Database, PlusCircle, LayoutDashboard } from "lucide-react";

/** Düz string: Next 16'da `{ default }` tek başına geçersiz (template zorunlu). */
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
} satisfies Metadata;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-[var(--color-neo-bg)] h-screen overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-[280px] bg-[var(--color-neo-border)] text-white flex flex-col h-full shadow-[4px_0_0_0_rgba(255,100,100,1)] z-10 shrink-0">
         <div className="p-6 border-b-4 border-white">
          <h2 className="text-3xl font-bold font-serif mb-3 tracking-widest text-center text-[var(--color-neo-yellow)]">
            EduFrancais
            <br/><span className="text-white text-lg">Admin CMS</span>
          </h2>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-4 font-bold text-lg mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded border-2 border-transparent hover:border-white transition-all text-gray-300 hover:text-white">
            <LayoutDashboard size={24} /> Öğrenci Portalı
          </Link>
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded border-2 border-transparent hover:border-white transition-all text-[var(--color-neo-yellow)]">
            <Database size={24} /> Veritabanı (Modüller)
          </Link>
          <div className="flex items-center gap-3 p-3 rounded border-2 border-transparent text-gray-400 opacity-50 cursor-not-allowed">
            <PlusCircle size={24} /> Yeni İçerik Ekle
          </div>
        </nav>
      </aside>

      <main className="flex-1 h-full overflow-y-auto p-8 relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#1E1E1E 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
