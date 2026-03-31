"use client";
import { useState, useEffect } from 'react';
import { Mic, Square, Eye, Watch } from 'lucide-react';

export default function POPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 120s = 2 dakika
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRecording(false);
      setIsFinished(true);
    }
    return () => clearInterval(timer);
  }, [isRecording, timeLeft]);

  const toggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsFinished(true);
    } else {
      setIsRecording(true);
      setIsFinished(false);
      if (timeLeft === 0) setTimeLeft(120);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <span className="neo-box px-3 py-1 text-sm font-bold uppercase neo-bg-green text-white shadow-none border-2">PO (Konuşma)</span>
          <span className="font-sans font-bold text-[var(--color-neo-border)]/60 bg-gray-200 border-2 border-[var(--color-neo-border)] px-3 py-1 rounded">B1 • Monolog Kesintisiz Konuşma</span>
        </div>
        <h1 className="text-5xl text-[var(--color-neo-border)] relative inline-block">
          Teknoloji Bağımlılığı
          <span className="absolute -bottom-2 left-0 w-full h-4 bg-[var(--color-neo-green)] -z-10 skew-x-12"></span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Recording Area */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          <div className="neo-box p-10 bg-white shadow-[8px_8px_0_0_rgba(30,30,30,1)]">
            <h3 className="font-bold text-2xl mb-4 text-gray-400 font-sans border-b-2 pb-2">Konu Kartı (Sujet)</h3>
            <p className="text-4xl font-serif font-black text-[var(--color-neo-border)] leading-tight mb-6">
              "Les smartphones nous éloignent-ils les uns des autres ?"
            </p>
            <p className="text-xl font-medium font-sans text-gray-700">
              Bu konu hakkında kişisel fikrinizi belirten en az 2 dakikalık bir monolog (kendi kendine konuşma) hazırlayın. Argümanlarınızı günlük hayattan örneklerle detaylandırın.
            </p>
          </div>

          <div className={`neo-box p-16 flex flex-col items-center justify-center transition-colors duration-500 border-[6px] ${isRecording ? 'bg-red-50 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : isFinished ? 'bg-green-50 border-green-500' : 'bg-[#F3F4F6] border-[var(--color-neo-border)]'}`}>
            <div className="text-7xl font-mono font-black mb-10 tabular-nums flex items-center gap-4">
              <Watch size={56} className={isRecording ? 'animate-pulse text-red-500' : ''} /> {formatTime(timeLeft)}
            </div>
            
            {!isFinished ? (
              <button 
                onClick={toggleRecord}
                className={`flex items-center gap-3 px-10 py-5 rounded-full font-black text-2xl transition-all ${isRecording ? 'bg-black text-white hover:bg-gray-800' : 'bg-red-500 text-white hover:bg-red-600 shadow-[6px_6px_0_0_rgba(30,30,30,1)] hover:translate-y-1 hover:shadow-none border-4 border-[var(--color-neo-border)]'}`}
              >
                {isRecording ? <><Square size={28} className="fill-current animate-pulse" /> Kaydı Bitir</> : <><Mic size={28} /> Konuşmaya Başla (Kayıt)</>}
              </button>
            ) : (
              <div className="flex gap-4">
                <button className="neo-btn !bg-white text-xl flex items-center gap-2 hover:bg-gray-100" onClick={() => { setIsFinished(false); setTimeLeft(120); }}><Mic size={20} /> Yeniden Al</button>
                <button className="neo-btn neo-bg-blue !text-white text-xl flex items-center gap-2 hover:bg-blue-600"><Eye size={20} /> Değerlendirmeye Gönder</button>
              </div>
            )}
            
            {isRecording && (
              <p className="mt-8 text-red-500 font-bold text-lg animate-pulse">Sistem Sesinizi Dinliyor ve Kaydediyor...</p>
            )}
          </div>
        </div>

        {/* Sidebar - Support Elements */}
        <div className="col-span-1 space-y-8">
          <div className="neo-box p-8 bg-yellow-50 !border-[4px]">
            <h4 className="font-black text-2xl mb-6 font-sans border-b-4 border-[var(--color-neo-border)] inline-block pb-1">Bağlaç Rehberi</h4>
            <ul className="space-y-4 font-bold font-sans text-xl">
              <li className="bg-white p-3 rounded border-[3px] border-[var(--color-neo-border)] shadow-[2px_2px_0_0_rgba(30,30,30,1)]">À mon avis... <span className="text-gray-400 text-sm block font-normal">(Bence)</span></li>
              <li className="bg-white p-3 rounded border-[3px] border-[var(--color-neo-border)] shadow-[2px_2px_0_0_rgba(30,30,30,1)]">D'une part... <span className="text-gray-400 text-sm block font-normal">(Bir yandan)</span></li>
              <li className="bg-white p-3 rounded border-[3px] border-[var(--color-neo-border)] shadow-[2px_2px_0_0_rgba(30,30,30,1)]">Cependant <span className="text-gray-400 text-sm block font-normal">(Bununla birlikte)</span></li>
              <li className="bg-white p-3 rounded border-[3px] border-[var(--color-neo-border)] shadow-[2px_2px_0_0_rgba(30,30,30,1)]">En conclusion <span className="text-gray-400 text-sm block font-normal">(Sonuç olarak)</span></li>
            </ul>
          </div>

          <div className="neo-box p-6 bg-white !border-[4px]">
            <h4 className="font-black text-xl mb-3">Puanlama Kriteri</h4>
            <p className="text-gray-600 font-sans text-base font-medium leading-relaxed">Özellikle akıcılık (fluidité), sözcük dağarcığı çeşitliliği (vocabulaire) ve fikirleri birbirine bağlama (cohérence) yeteneğiniz AI/Öğretmen tarafından ölçülecektir.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
