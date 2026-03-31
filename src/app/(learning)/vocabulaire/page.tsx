"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, ArrowRight, ArrowLeft, BrainCircuit } from 'lucide-react';

const vocabList = [
  { id: 1, fr: "Cependant", tr: "Bununla birlikte, ancak", context: "Il a étudié très dur, cependant il a échoué à l'examen.", type: "Connecteur Logique" },
  { id: 2, fr: "Démarche", tr: "Yöntem, adım, yaklaşım", context: "La démarche scientifique est essentielle pour l'avenir.", type: "Académique" },
  { id: 3, fr: "Néanmoins", tr: "Yine de", context: "C'est un sujet difficile, néanmoins nous allons essayer.", type: "Connecteur Logique" },
  { id: 4, fr: "Atout", tr: "Avantaj, koz", context: "Parler plusieurs langues est un atout majeur dans le monde du travail.", type: "Voca Général" },
];

export default function VocabulairePage() {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = vocabList[index];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % vocabList.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + vocabList.length) % vocabList.length);
    }, 150);
  };

  return (
    <div className="space-y-8 pb-20 overflow-hidden">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <span className="neo-box px-3 py-1 text-sm font-bold uppercase neo-bg-yellow text-[var(--color-neo-border)] border-2">Vocabulaire</span>
          <span className="font-sans font-bold text-gray-600 bg-white border-2 border-[var(--color-neo-border)] px-3 py-1 rounded">DELF B1 / B2 Seti</span>
        </div>
        <h1 className="text-5xl text-[var(--color-neo-border)]">Kelime Kasası</h1>
      </header>

      <div className="flex flex-col items-center mt-12 mx-auto max-w-2xl px-4">
        {/* Progress Tracker */}
        <div className="flex items-center gap-2 mb-8">
           {vocabList.map((_, i) => (
             <div key={i} className={`h-3 w-12 border-2 border-[var(--color-neo-border)] ${i <= index ? 'bg-[var(--color-neo-blue)]' : 'bg-white'}`} />
           ))}
        </div>

        {/* 3D Container for Flip using Framer Motion */}
        <div className="relative w-full h-[380px]" style={{ perspective: "1200px" }}>
          <motion.div
            className="w-full h-full relative cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
          >
             {/* Front of Card */}
             <div className="absolute w-full h-full neo-box border-[6px] bg-white flex flex-col items-center justify-center p-8 text-center" style={{ backfaceVisibility: "hidden" }}>
                <span className="text-sm font-bold bg-[#FDF9F1] px-4 py-1 rounded border-2 border-[var(--color-neo-border)] absolute top-6 right-6 font-sans">
                  {card.type}
                </span>
                <button className="absolute top-6 left-6 p-3 rounded-full hover:bg-[var(--color-neo-yellow)] transition-colors border-2 border-[var(--color-neo-border)] bg-gray-50 flex items-center justify-center neo-box !shadow-sm" onClick={(e) => { e.stopPropagation(); }}>
                  <Volume2 size={24} />
                </button>
                <h2 className="text-7xl font-serif text-[var(--color-neo-border)] mt-8 group-hover:scale-105 transition-transform">{card.fr}</h2>
                <div className="absolute bottom-8 text-gray-400 font-bold flex items-center gap-2 font-sans bg-gray-100 px-6 py-2 rounded-full border-2 border-gray-300">
                  Çevirmek için karta tıkla <ArrowRight size={20} className="animate-pulse text-[var(--color-neo-border)]" />
                </div>
             </div>

             {/* Back of Card */}
             <div className="absolute w-full h-full neo-box border-[6px] bg-[var(--color-neo-purple)] flex flex-col items-center justify-center p-8 text-center text-white" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <span className="text-sm font-bold bg-white/20 px-4 py-1 rounded border-2 border-white absolute top-6 right-6 font-sans text-white">
                  Türkçe Anlamı
                </span>
                <h2 className="text-5xl font-sans font-black mb-8 underline decoration-4 decoration-[var(--color-neo-yellow)] underline-offset-8">{card.tr}</h2>
                <div className="bg-white text-[var(--color-neo-border)] p-6 neo-box !border-4 !shadow-[4px_4px_0_0_rgba(255,255,255,0.3)] w-full">
                  <p className="font-serif italic text-2xl mb-2 text-left leading-relaxed">"{card.context}"</p>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Professional Controls instead of Emojis */}
        <div className="w-full mt-10 p-6 bg-white neo-box !border-[4px] flex flex-col items-center">
            <h4 className="font-bold text-gray-500 mb-4 font-sans uppercase tracking-wider text-sm flex items-center gap-2"><BrainCircuit size={18}/> Akademik Algoritma Beslemesi</h4>
            <div className="flex gap-4 w-full">
              <button 
                onClick={handleNext} 
                className="flex-1 neo-btn !py-4 bg-red-100 hover:bg-red-200 border-[3px] shadow-[4px_4px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] text-red-700 font-bold text-lg transition-all"
              >
                 Niveau 3 <br/><span className="text-sm font-normal">Geliştirilmeli (Zor)</span>
              </button>
              <button 
                onClick={handleNext} 
                className="flex-1 neo-btn !py-4 bg-blue-100 hover:bg-blue-200 border-[3px] shadow-[4px_4px_0_0_rgba(37,99,235,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] text-blue-700 font-bold text-lg transition-all"
              >
                 Niveau 2 <br/><span className="text-sm font-normal">Tekrar Edilmeli</span>
              </button>
              <button 
                onClick={handleNext} 
                className="flex-1 neo-btn !py-4 bg-green-100 hover:bg-green-200 border-[3px] shadow-[4px_4px_0_0_rgba(22,163,74,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] text-green-700 font-bold text-lg transition-all"
              >
                 Niveau 1 <br/><span className="text-sm font-normal">Mükemmel (Kolay)</span>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
