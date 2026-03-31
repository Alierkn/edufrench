"use client";
import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save, Clock, BrainCircuit, Type, AlertCircle } from 'lucide-react';
import { getRandomModule } from '../actions';

interface ModuleData {
  title: string;
  level: string;
  description: string | null;
  exercises: {
    id: string;
    content: string;
    options: { id: string; text: string; isCorrect: boolean }[];
  }[];
}

export default function CEPage() {
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRandomModule("CE").then((res) => {
      setModuleData(res as any);
      setIsLoading(false);
      
      if (res?.id) {
         fetch('/api/send-fomo', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ moduleId: res.id, action: "start" })
         }).catch(err => console.error("Fomo API Error", err));
      }
    });
  }, []);

  if (isLoading) return <div className="p-8 text-2xl font-bold font-sans animate-pulse text-[var(--color-neo-border)]">Yayıncı Veritabanından Modül Yükleniyor...</div>;

  if (!moduleData) return (
    <div className="p-8 neo-box bg-red-50 text-red-500 font-bold border-[4px]">
      Henüz CE modülü için veritabanında (CMS) içerik yok. Lütfen Admin Paneline gidip sistemi doldurun (Seed edin).
    </div>
  );

  const exercise = moduleData.exercises[0];

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end mb-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="neo-box px-3 py-1 text-sm font-bold uppercase bg-[var(--color-neo-blue)] text-white shadow-none border-2">CE (Okuma)</span>
            <span className="font-sans font-bold text-[var(--color-neo-border)]/60 bg-gray-200 border-2 border-[var(--color-neo-border)] px-3 py-1 rounded">Seviye {moduleData.level} • Test</span>
            <span className="flex items-center gap-1 font-bold text-gray-500 font-mono"><Clock size={16} /> 15m</span>
          </div>
          <h1 className="text-5xl text-[var(--color-neo-border)] relative inline-block">
            {moduleData.title}
            <span className="absolute -bottom-2 left-0 w-full h-4 bg-[var(--color-neo-yellow)] -z-10 skew-x-12"></span>
          </h1>
        </div>
      </header>

      {/* Pedagojik Tüyo */}
      {moduleData.description && (
        <div className="flex items-start gap-4 p-4 neo-box bg-white !border-4 !border-[var(--color-neo-yellow)] !shadow-none">
          <BrainCircuit className="text-orange-500 shrink-0" size={32} />
          <div>
            <h4 className="font-bold font-sans">Pedagojik Strateji</h4>
            <p className="font-medium text-gray-700 font-sans">{moduleData.description}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Metin (Texte) */}
        <div className="neo-box p-8 bg-[#FDF9F1] border-[4px] border-[var(--color-neo-border)] shadow-[8px_8px_0_0_rgba(30,30,30,1)]">
          <h3 className="font-bold text-xl mb-6 text-gray-400 font-sans border-b-2 pb-2 flex items-center gap-2"><Type size={20} /> Okuma Parçası</h3>
          <p className="text-xl font-medium font-serif leading-relaxed text-[var(--color-neo-border)] whitespace-pre-wrap">
            {exercise.content.split('Soru:')[0]}
          </p>
        </div>

        {/* Sorular */}
        <div className="neo-box p-8 bg-white border-[4px]">
          <h3 className="text-2xl font-bold mb-6 font-sans flex items-center gap-2 bg-[var(--color-neo-yellow)] px-3 py-1 inline-block border-2 border-black rounded shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-[var(--color-neo-border)]">
            🌟 Soru Kökü
          </h3>
          <p className="text-2xl font-black font-sans mb-8 leading-tight">
            {exercise.content.includes('Soru:') ? exercise.content.split('Soru:')[1] : "Yazının anafikri nedir?"}
          </p>

          <div className="space-y-4">
            {exercise.options.map((option) => (
              <button 
                key={option.id}
                onClick={() => !isSubmitted && setSelectedAnswer(option.id)}
                className={`w-full text-left p-5 neo-box text-xl font-bold font-sans transition-all active:scale-[0.98] ${
                  selectedAnswer === option.id 
                    ? 'bg-[var(--color-neo-border)] text-white shadow-[2px_2px_0_0_rgba(30,30,30,1)] translate-y-[2px] translate-x-[2px]' 
                    : 'bg-white hover:bg-gray-100 shadow-[6px_6px_0_0_rgba(30,30,30,1)]'
                } ${isSubmitted && option.isCorrect ? '!bg-green-400 !text-[var(--color-neo-border)] !border-4 !shadow-none translate-y-[4px] translate-x-[4px]' : ''}
                ${isSubmitted && selectedAnswer === option.id && !option.isCorrect ? '!bg-red-400 !text-white !border-4 !shadow-none' : ''}`}
                disabled={isSubmitted}
              >
                <div className="flex justify-between items-center">
                  <span>{option.text}</span>
                  {(isSubmitted && selectedAnswer === option.id && !option.isCorrect) && <AlertCircle className="text-white animate-bounce" />}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 flex justify-between items-center">
             {!isSubmitted ? (
                <button 
                  className={`neo-btn text-xl px-8 !py-4 flex items-center gap-2 ${selectedAnswer ? 'neo-bg-green !text-[var(--color-neo-border)] hover:bg-green-300' : 'bg-gray-200 text-gray-400 !shadow-none cursor-not-allowed'}`}
                  onClick={() => selectedAnswer && setIsSubmitted(true)}
                  disabled={!selectedAnswer}
                >
                  Cevabı Kontrol Et <BrainCircuit size={24} />
                </button>
             ) : (
                <div className="w-full flex items-center justify-between animate-in slide-in-from-bottom-2">
                   <button className="font-bold flex items-center gap-2 underline text-gray-500 hover:text-black hover:bg-gray-100 p-2 rounded transition"><ArrowLeft size={18} /> Önceki Metin</button>
                   <button className="neo-btn bg-[var(--color-neo-border)] text-white text-xl px-8 flex items-center gap-2 hover:bg-black transition-colors">
                     Sıradaki Metne Geç <ArrowRight />
                   </button>
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
