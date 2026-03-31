"use client";
import Link from 'next/link';
import { Target, TrendingUp, Zap, LogOut, ArrowRight, BookOpen, Headphones, Library, BrainCircuit, Mic } from 'lucide-react';
import { useProgress } from '@/store/useProgress';
import { useEffect, useState } from 'react';

// Map weakness strings to correct modules and icons
const getRecommendation = (weakness: string) => {
  if (weakness.toLowerCase().includes('grammaire') || weakness.includes('Pronoms')) {
    return { title: "Grammaire (Les Pronoms Relatifs)", href: "/grammaire", icon: <Library className="text-red-500" size={32} /> };
  } else if (weakness.toLowerCase().includes('dinleme') || weakness.includes('detay')) {
    return { title: "CO Dinleme (Mesleki Yönelim)", href: "/co", icon: <Headphones className="text-pink-500" size={32} /> };
  } else if (weakness.toLowerCase().includes('okuma')) {
    return { title: "CE Okuma Pratiği", href: "/ce", icon: <BookOpen className="text-[var(--color-neo-blue)]" size={32} /> };
  } else if (weakness.toLowerCase().includes('bağlaç')) {
    return { title: "PE Yazma (Bağlaçlar)", href: "/pe", icon: <BrainCircuit className="text-[var(--color-neo-purple)]" size={32} /> };
  }
  return { title: "Vocabulaire Set 1", href: "/vocabulaire", icon: <Zap className="text-yellow-500" size={32} /> };
};

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const { weaknesses, totalScore } = useProgress();

  useEffect(() => {
    // Prevent SSR Hydration Mismatch for persist store
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="p-8 text-2xl font-bold">Yükleniyor...</div>;

  // "Bugünün Odak Çalışması" algoritması
  // Kullanıcının zayıflıkları store'da var ise ilk zayıf yönünü alır. Yoksa Vocab önerir.
  const targetWeakness = weaknesses.length > 0 ? weaknesses[0] : "Genel Kelime Tekrarı";
  const recommendation = getRecommendation(targetWeakness);

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end mb-8 border-b-4 border-[var(--color-neo-border)] pb-6">
        <div>
          <h1 className="text-5xl font-black font-sans text-[var(--color-neo-border)] mb-2">Bonjour, Öğrenci.</h1>
          <p className="text-xl font-bold text-gray-400">EduFrancais Akademik Portalı'na Hoş Geldin.</p>
        </div>
        <button className="flex items-center gap-2 font-bold text-gray-500 hover:text-red-500 transition-colors bg-white px-4 py-2 neo-box !border-2">
          <LogOut size={18} /> Çıkış
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recommendation Widget (Bugünün Odak Çalışması) */}
        <div className="col-span-1 md:col-span-2 neo-box p-8 bg-[var(--color-neo-yellow)] flex flex-col justify-between transform transition-transform hover:-translate-y-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="bg-white px-3 py-1 font-bold font-sans text-sm uppercase rounded shadow-[2px_2px_0_0_rgba(30,30,30,1)] border-2 border-[var(--color-neo-border)] text-[var(--color-neo-border)] flex items-center gap-2">
                 <Target size={18} /> Akıllı Odak Algoritması
              </span>
              {recommendation.icon}
            </div>
            <h2 className="text-4xl font-serif font-black text-[var(--color-neo-border)] leading-tight mt-6 mb-2">Zayıflık Tespit Edildi: <br/> "{targetWeakness}"</h2>
            <p className="font-bold text-gray-700 font-sans text-lg">Son çalışmandaki eksikliklerine dayanarak bugün {recommendation.title} pratiği yapmanı öneriyoruz.</p>
          </div>
          
          <Link href={recommendation.href} className="neo-btn mt-8 flex justify-between items-center text-xl !py-4 bg-white hover:bg-black hover:text-white transition-colors">
            {recommendation.title} Modülüne Git <ArrowRight />
          </Link>
        </div>

        {/* Skor & İlerleme Paneli */}
        <div className="neo-box p-6 bg-white flex flex-col justify-between">
          <h3 className="font-bold text-xl text-gray-400 font-sans border-b-2 pb-2 mb-4">Akademik Metrikler</h3>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            
            <div className="bg-blue-50 p-4 neo-box !border-[3px] flex items-center gap-4">
               <div className="p-3 bg-[var(--color-neo-blue)] text-white neo-box !border-2">
                  <TrendingUp size={24} />
               </div>
               <div>
                  <p className="text-sm font-bold text-gray-500 uppercase">Toplam Puan</p>
                  <p className="text-3xl font-black font-mono">{totalScore}</p>
               </div>
            </div>

            <div className="bg-red-50 p-4 neo-box !border-[3px]">
              <p className="text-sm font-bold text-gray-500 uppercase mb-2">Çözülememiş Hedefler (Zayıflıklar)</p>
              <div className="flex flex-wrap gap-2">
                {weaknesses.map((w, i) => (
                  <span key={i} className="text-xs font-bold bg-white text-red-600 px-2 py-1 border-2 border-[var(--color-neo-border)]">{w}</span>
                ))}
                {weaknesses.length === 0 && <span className="text-sm font-bold text-green-600">Mükemmel! Zayıflık yok.</span>}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold font-sans mb-6 text-[var(--color-neo-border)]">Son Modüllerine Hızlı Dön</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/ce" className="neo-box p-5 bg-white hover:bg-[var(--color-neo-blue)] hover:text-white group transition-colors cursor-pointer !shadow-sm hover:!shadow-[4px_4px_0_0_rgba(30,30,30,1)] hover:-translate-y-1">
             <BookOpen size={28} className="text-[var(--color-neo-blue)] group-hover:text-white mb-3" />
             <h4 className="font-bold text-xl font-sans group-hover:underline">CE (Okuma)</h4>
          </Link>
          <Link href="/po" className="neo-box p-5 bg-white hover:bg-[var(--color-neo-green)] hover:text-[var(--color-neo-border)] group transition-colors cursor-pointer !shadow-sm hover:!shadow-[4px_4px_0_0_rgba(30,30,30,1)] hover:-translate-y-1">
             <Mic size={28} className="text-[var(--color-neo-green)] group-hover:text-black mb-3" />
             <h4 className="font-bold text-xl font-sans group-hover:underline">PO (Konuşma)</h4>
          </Link>
          <Link href="/pe" className="neo-box p-5 bg-white hover:bg-[var(--color-neo-purple)] hover:text-white group transition-colors cursor-pointer !shadow-sm hover:!shadow-[4px_4px_0_0_rgba(30,30,30,1)] hover:-translate-y-1">
             <BrainCircuit size={28} className="text-[var(--color-neo-purple)] group-hover:text-white mb-3" />
             <h4 className="font-bold text-xl font-sans group-hover:underline">PE (Yazma)</h4>
          </Link>
          <Link href="/grammaire" className="neo-box p-5 bg-white hover:bg-red-500 hover:text-white group transition-colors cursor-pointer !shadow-sm hover:!shadow-[4px_4px_0_0_rgba(30,30,30,1)] hover:-translate-y-1">
             <Library size={28} className="text-red-500 group-hover:text-white mb-3" />
             <h4 className="font-bold text-xl font-sans group-hover:underline">Grammaire</h4>
          </Link>
        </div>
      </div>
    </div>
  );
}
