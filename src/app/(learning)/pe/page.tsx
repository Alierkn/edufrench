"use client";
import { useState } from 'react';
import { PenTool, BrainCircuit, Type, FileText } from 'lucide-react';

export default function PEPage() {
  const [text, setText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  return (
    <div className="space-y-8 pb-20">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <span className="neo-box px-3 py-1 text-sm font-bold uppercase neo-bg-purple text-white shadow-none border-2">PE (Yazma)</span>
          <span className="font-sans font-bold text-[var(--color-neo-border)]/60 bg-gray-200 border-2 border-[var(--color-neo-border)] px-3 py-1 rounded">10. Sınıf • Sujet: L'Environnement</span>
        </div>
        <h1 className="text-5xl text-[var(--color-neo-border)] relative inline-block">
          La Protection de la Nature
        </h1>
      </header>

      {/* Sujet (Görev) */}
      <div className="neo-box p-8 bg-purple-50 flex items-start gap-4">
        <FileText size={36} className="text-[var(--color-neo-purple)] shrink-0" />
        <div>
          <h4 className="font-bold text-xl mb-2 font-sans">Görev Kartı (Sujet)</h4>
          <p className="text-lg font-medium text-gray-800 font-sans leading-relaxed">
            Vous avez remarqué que votre lycée gaspille beaucoup de plastique. Vous écrivez un court texte (100-150 mots) pour le journal de l'école afin de proposer deux solutions écologiques.
          </p>
        </div>
      </div>

      {/* Yazı Alanı */}
      <div className="space-y-4">
        <div className="neo-box p-0 bg-white overflow-hidden focus-within:ring-4 focus-within:ring-[var(--color-neo-purple)]/30 transition-shadow">
          <div className="bg-gray-100 border-b-4 border-[var(--color-neo-border)] p-4 flex justify-between items-center font-bold font-sans text-lg">
            <span className="flex items-center gap-2"><PenTool size={20} /> Metin Editörü</span>
            <span className={`${wordCount < 100 ? 'text-orange-500' : 'text-green-600'} flex items-center gap-1`}>
              <Type size={20} /> {wordCount} / 150 kelime
            </span>
          </div>
          <textarea 
            value={text}
            onChange={(e) => !isSubmitted && setText(e.target.value)}
            disabled={isSubmitted}
            placeholder="Écrivez votre texte ici... (En az 100 kelime yazmayı hedefleyin)"
            className="w-full h-[350px] p-6 text-xl font-sans resize-none focus:outline-none bg-transparent disabled:bg-gray-50 leading-relaxed"
          ></textarea>
        </div>

        {!isSubmitted ? (
          <div className="flex justify-end mt-6">
            <button 
              className={`neo-btn text-xl px-10 py-5 flex items-center gap-3 ${wordCount > 10 ? 'neo-bg-green !text-[var(--color-neo-border)] hover:bg-green-400' : 'bg-gray-200 text-gray-400 !shadow-none cursor-not-allowed'}`}
              onClick={() => wordCount > 10 && setIsSubmitted(true)}
              disabled={wordCount <= 10}
            >
              Taslağı Kontrol Et (Analiz) <BrainCircuit size={28} />
            </button>
          </div>
        ) : (
          <div className="neo-box p-10 bg-[#FDF9F1] border-[4px] border-[var(--color-neo-border)] mt-10 animate-in slide-in-from-bottom-4 shadow-[10px_10px_0_0_rgba(30,30,30,1)]">
            <h3 className="text-3xl font-bold mb-8 font-sans flex items-center gap-3 text-[var(--color-neo-border)]"><BrainCircuit className="text-[var(--color-neo-purple)]" size={36} /> Akademik Feedback Modülü</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white neo-box p-8 !border-[3px]">
                <h4 className="font-bold text-2xl mb-4 text-green-600">Güçlü Fikirler 👍</h4>
                <ul className="list-disc list-inside space-y-3 font-medium font-sans text-lg">
                  <li>Kelime sayısı (Word Count) hedefine başarıyla ulaşıldı.</li>
                  <li>"Il faut que" kalıbı (Subjonctif yapısı) doğru bağlamda kullanılmış.</li>
                </ul>
              </div>
              <div className="bg-white neo-box p-8 !border-[3px] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-3 h-full bg-orange-400"></div>
                <h4 className="font-bold text-2xl mb-4 text-orange-600 pl-6">Gelişim Alanları 🛠️</h4>
                <ul className="list-disc list-inside space-y-4 font-medium font-sans text-lg pl-6">
                  <li><strong>Bağlaç Eksikliği:</strong> Cümleleri bağlarken (Connecteurs Logiques) <em>"De plus"</em> veya <em>"En conclusion"</em> gibi bağlaçlar eklenebilir.</li>
                  <li><strong>Grammaire:</strong> "Beaucoup <span className="text-red-500 line-through">des</span> plastiques" kalıbı Fransızcada yanlıştır. Onun yerine "Beaucoup <span className="text-green-600 font-bold">de</span> plastique" olmalı.</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-10 flex justify-end">
               <button className="neo-btn bg-white hover:bg-gray-100 flex items-center gap-2 text-xl !py-4" onClick={() => setIsSubmitted(false)}>
                 <PenTool size={20} /> Taslağa Dön & Değiştir
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
