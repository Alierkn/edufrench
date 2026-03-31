"use client";
import { useState, useEffect } from 'react';
import { Play, Pause, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function COPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock audio logic effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1; // 1% artış
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (progress >= 100) setProgress(0); // Bittiğinde baştan sar
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <span className="neo-box px-3 py-1 text-sm font-bold uppercase bg-[var(--color-neo-pink)] text-white shadow-none border-2">CO (Dinleme)</span>
          <span className="font-sans font-bold text-[var(--color-neo-border)]/60 bg-gray-200 border-2 border-[var(--color-neo-border)] px-3 py-1 rounded">Diyalog: L'Orientation Professionnelle</span>
        </div>
        <h1 className="text-5xl text-[var(--color-neo-border)] relative inline-block">
          Mesleki Yönelim
          <span className="absolute -bottom-2 left-0 w-full h-4 bg-[var(--color-neo-yellow)] -z-10 skew-x-12"></span>
        </h1>
      </header>

      {/* Ses Player */}
      <div className="neo-box p-8 bg-blue-50 border-[4px] border-[var(--color-neo-border)] shadow-[6px_6px_0_0_rgba(30,30,30,1)] flex items-center gap-6">
        <button 
          onClick={handleTogglePlay}
          className="w-[72px] h-[72px] shrink-0 rounded-full bg-[var(--color-neo-blue)] neo-box !border-4 !rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause size={36} className="fill-current" /> : <Play size={36} className="ml-1 fill-current" />}
        </button>
        <div className="flex-1">
          <div className="flex justify-between mb-3 font-bold font-sans text-xl text-[var(--color-neo-border)]">
            <span>{isPlaying ? 'Dinleniyor...' : (progress === 100 ? 'Dinleme Bitti' : 'Röportaj Kaydı (Piste 1)')}</span>
            <span>01:15</span>
          </div>
          <div className="h-6 w-full bg-white neo-box !border-2 !p-0 overflow-hidden relative cursor-pointer" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress((e.clientX - rect.left) / rect.width * 100);
          }}>
             <div className="h-full bg-[var(--color-neo-purple)] transition-all duration-100 ease-linear border-r-2 border-[var(--color-neo-border)]" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Strateji Tüyosu */}
      <div className="neo-box p-6 bg-white flex items-start gap-4">
        <AlertCircle size={36} className="text-orange-500 shrink-0" />
        <div>
          <h4 className="font-bold text-xl mb-1 flex items-center gap-2">Odaklanma Tüyosu</h4>
          <p className="text-lg font-medium text-gray-700 font-sans">İlk dinlemede kızın asıl tercih etmek istediği bölümün ismini (Informatique / Droit) ve ailenin beklentisini birbirinden ayırmaya çalış.</p>
        </div>
      </div>

      {/* Sorular */}
      <div className="neo-box p-8 bg-[#F3F4F6]">
        <h3 className="text-2xl font-bold mb-6 font-sans text-[var(--color-neo-border)] bg-gray-200 px-4 py-2 inline-block rounded neo-box !border-2 !shadow-sm">Question 1: Ana Fikir</h3>
        <p className="text-2xl font-black font-sans mb-8">Que veut étudier la fille, contrairement au souhait de ses parents ?</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id: 1, text: "Le droit (Hukuk)" },
            { id: 2, text: "L'informatique (Yazılım)" },
            { id: 3, text: "La médecine (Tıp)" },
            { id: 4, text: "L'architecture (Mimarlık)" }
          ].map((option) => (
             <button 
              key={option.id}
              onClick={() => !isSubmitted && setSelected(option.id)}
              className={`w-full text-left p-6 neo-box text-xl font-bold font-sans transition-all ${
                selected === option.id 
                  ? 'bg-[var(--color-neo-border)] text-white shadow-[2px_2px_0_0_rgba(30,30,30,1)] translate-y-[2px] translate-x-[2px]' 
                  : 'bg-white hover:bg-gray-100'
              } ${isSubmitted && option.id === 2 ? '!bg-green-400 !text-[var(--color-neo-border)] !border-4' : ''}
              ${isSubmitted && selected === option.id && option.id !== 2 ? '!bg-red-400 !text-white !border-4' : ''}`}
              disabled={isSubmitted}
            >
              <div className="flex justify-between items-center">
                <span>{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          {!isSubmitted ? (
            <button 
              className={`neo-btn text-xl px-10 py-4 ${selected ? 'neo-bg-green !text-[var(--color-neo-border)] hover:bg-green-300' : 'bg-gray-200 text-gray-400 !shadow-none cursor-not-allowed'}`}
              onClick={() => selected && setIsSubmitted(true)}
              disabled={!selected}
            >
              Cevabı Kilitle
            </button>
          ) : (
            <div className="w-full flex items-center justify-between animate-in slide-in-from-bottom-2 bg-yellow-50 p-6 neo-box">
               <button className="font-bold underline text-[var(--color-neo-border)] hover:bg-white p-2 rounded transition">Transcripti İncele</button>
               <button className="neo-btn bg-[var(--color-neo-border)] text-white text-xl px-8 flex items-center gap-2 hover:bg-black">
                 İkinci Dinleme (Detay) <Play size={20} className="fill-current" />
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
