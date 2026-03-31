import Link from "next/link";
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Library,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";
import { SidebarGradeBadge } from "@/components/SidebarGradeBadge";

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen md:h-screen overflow-hidden bg-[var(--color-neo-bg)] flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-[280px] md:shrink-0 border-b-4 md:border-b-0 md:border-r-4 border-[var(--color-neo-border)] bg-white flex flex-col md:h-full shadow-[4px_0_0_0_rgba(30,30,30,1)] z-10 max-h-[50vh] md:max-h-none overflow-y-auto">
        <div className="p-6 border-b-4 border-[var(--color-neo-border)]">
          <Link href="/">
            <h2 className="text-2xl font-bold font-serif mb-3 hover:underline">EduFrancais.</h2>
          </Link>
          <SidebarGradeBadge />
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded font-bold border-2 border-transparent hover:border-[var(--color-neo-border)] hover:bg-[var(--color-neo-yellow)] transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          
          <div className="pt-6 pb-2 px-3 text-sm font-bold text-gray-400 capitalize">Ana Modüller</div>
          <Link href="/ce" className="flex items-center gap-3 p-3 rounded font-bold border-2 border-transparent hover:border-[var(--color-neo-border)] transition-all">
            <span className="neo-box p-1 bg-white"><BookOpen size={16} className="text-[var(--color-neo-blue)]" /></span> CE (Okuma)
          </Link>
          <Link href="/co" className="flex items-center gap-3 p-3 rounded font-bold border-2 border-transparent hover:border-[var(--color-neo-border)] transition-all">
            <span className="neo-box p-1 bg-white"><Headphones size={16} className="text-[var(--color-neo-pink)]" /></span> CO (Dinleme)
          </Link>
          <Link href="/pe" className="flex items-center gap-3 p-3 rounded font-bold border-2 border-transparent hover:border-[var(--color-neo-border)] transition-all">
            <span className="neo-box p-1 bg-white"><PenTool size={16} className="text-[var(--color-neo-purple)]" /></span> PE (Yazma)
          </Link>
          <Link href="/po" className="flex items-center gap-3 p-3 rounded font-bold border-2 border-transparent hover:border-[var(--color-neo-border)] transition-all">
            <span className="neo-box p-1 bg-white"><Mic size={16} className="text-[var(--color-neo-green)]" /></span> PO (Konuşma)
          </Link>

          <div className="pt-6 pb-2 px-3 text-sm font-bold text-gray-400 capitalize">Destek Sistemleri</div>
          <Link href="/grammaire" className="flex items-center gap-3 p-3 rounded font-bold border-2 border-transparent hover:border-[var(--color-neo-border)] transition-all">
            <span className="neo-box p-1 bg-white"><Library size={16} className="text-red-500" /></span> Grammaire
          </Link>
          <Link href="/vocabulaire" className="flex items-center gap-3 p-3 rounded font-bold border-2 border-transparent hover:border-[var(--color-neo-border)] transition-all">
            <span className="neo-box p-1 bg-white"><GraduationCap size={16} className="text-orange-500" /></span> Vocabulaire
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-0 md:h-full overflow-y-auto p-4 sm:p-6 md:p-12 relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#1E1E1E 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
        <div className="relative z-10 w-full max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
