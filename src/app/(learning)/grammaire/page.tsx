"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library, ArrowRight, BrainCircuit, Type, FileText, CheckCircle2 } from 'lucide-react';

const GAMMAR_MODULES = [
  { id: 'pronoms', title: 'Les Pronoms Relatifs (qui, que, où, dont)', level: 'B1' },
  { id: 'subjonctif', title: 'Le Subjonctif Présent', level: 'B2' },
  { id: 'passe_compose', title: 'Le Passé Composé vs Imparfait', level: 'A2' }
];

export default function GrammairePage() {
  // States: 'catalog' | 'theory' | 'exercise' | 'result'
  const [phase, setPhase] = useState<'catalog' | 'theory' | 'exercise' | 'result'>('catalog');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [shake, setShake] = useState(false);

  // Flow Functions
  const openModule = (id: string) => {
    setActiveModule(id);
    setPhase('theory');
  };

  const checkAnswer = () => {
    if (answer.toLowerCase().trim() === 'dont') {
      setPhase('result');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="space-y-8 pb-20 overflow-hidden">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <span className="neo-box px-3 py-1 text-sm font-bold uppercase neo-bg-green text-[var(--color-neo-border)] shadow-none border-2">Grammaire</span>
          <span className="font-sans font-bold text-[var(--color-neo-border)]/60 bg-gray-200 border-2 border-[var(--color-neo-border)] px-3 py-1 rounded">Kurallar & Uygulamalar</span>
        </div>
        <h1 className="text-5xl text-[var(--color-neo-border)] relative inline-block">
          Dilbilgisi Modülleri
          <span className="absolute -bottom-2 left-0 w-full h-4 bg-[var(--color-neo-green)] -z-10 skew-x-12"></span>
        </h1>
      </header>

      <AnimatePresence mode="wait">
        
        {/* PHASE 1: MODÜL KATALOĞU */}
        {phase === 'catalog' && (
          <motion.div key="catalog" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
            <p className="text-xl font-medium text-gray-500 font-sans mb-8">Çalışmak istediğiniz konuyu seçerek adım adım ilerleyin.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GAMMAR_MODULES.map((mod) => (
                 <button 
                   key={mod.id}
                   onClick={() => openModule(mod.id)}
                   className="neo-box p-8 bg-white text-left hover:-translate-y-2 hover:bg-[var(--color-neo-yellow)] transition-transform group flex flex-col items-start gap-4"
                 >
                    <span className="font-black bg-black text-white px-3 py-1 font-mono text-lg">{mod.level}</span>
                    <h3 className="text-3xl font-serif text-[var(--color-neo-border)]">{mod.title}</h3>
                    <div className="mt-4 flex items-center gap-2 text-gray-500 font-bold group-hover:text-black">
                      Modüle Başla <ArrowRight />
                    </div>
                 </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* PHASE 2: KONU ANLATIMI (THEORY) */}
        {phase === 'theory' && (
          <motion.div key="theory" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="space-y-8">
            <button onClick={() => setPhase('catalog')} className="font-bold underline text-gray-500 mb-4">&larr; Kataloga Dön</button>
            <div className="neo-box p-10 bg-[#FDF9F1] border-[5px]">
               <h2 className="text-4xl font-black mb-6">Adım 1: Teori (Les Pronoms Relatifs)</h2>
               <div className="space-y-6 text-xl font-medium font-sans leading-relaxed text-gray-700">
                  <p>Fransızcada iki cümleyi bağlamak için kullandığımız zamirlerdir.</p>
                  <ul className="list-disc list-inside space-y-4 bg-white p-6 neo-box !border-4">
                    <li><strong className="text-blue-600">QUI:</strong> Öznenin yerini alır. <em>(Ce garçon qui parle...)</em></li>
                    <li><strong className="text-green-600">QUE:</strong> Nesnenin yerini alır. <em>(Le livre que je lis...)</em></li>
                    <li><strong className="text-red-600">DONT:</strong> "De" edatıyla kullanılan fiillerin nesnesini alır (Avoir besoin de, parler de). <em>(Le film dont je parle...)</em></li>
                  </ul>
               </div>
               <div className="mt-12 flex justify-end">
                 <button onClick={() => setPhase('exercise')} className="neo-btn px-10 py-5 bg-[var(--color-neo-blue)] text-white text-2xl flex items-center gap-4">
                   Kavrandı, Pratiğe Geç <ArrowRight size={28}/>
                 </button>
               </div>
            </div>
          </motion.div>
        )}

        {/* PHASE 3: UYGULAMA (EXERCISE) */}
        {phase === 'exercise' && (
          <motion.div key="exercise" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="space-y-8">
            <button onClick={() => setPhase('theory')} className="font-bold underline text-gray-500 mb-4">&larr; Teoriye Dön</button>
            <div className="neo-box p-10 bg-white border-[5px]">
               <div className="flex items-center gap-3 mb-6 bg-yellow-100 p-3 neo-box !border-[3px] !shadow-none">
                  <BrainCircuit size={28} className="text-orange-500" />
                  <h2 className="text-2xl font-black text-[var(--color-neo-border)]">Adım 2: Egzersiz</h2>
               </div>

               <p className="text-gray-500 font-bold mb-8 text-xl">Doğru zamiri klavyeden yazarak boşluğu doldurun.</p>

               <div className="bg-gray-50 p-8 neo-box border-[4px] border-[var(--color-neo-border)] flex flex-wrap items-center gap-4 text-3xl font-serif">
                  Le dictionnaire
                  <motion.input 
                    type="text" 
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    animate={shake ? { x: [-10, 10, -10, 10, 0], backgroundColor: ["#fee2e2", "#ffffff"] } : {}}
                    transition={{ duration: 0.4 }}
                    className="w-32 bg-white border-b-4 border-black text-center font-bold outline-none focus:border-[var(--color-neo-yellow)]" 
                    placeholder="???"
                  />
                  j'ai besoin.
               </div>

               <div className="mt-12 flex justify-between items-center">
                 <p className="text-gray-400 font-bold font-sans">İpucu: Fiil "Avoir besoin DE" dir.</p>
                 <button onClick={checkAnswer} className="neo-btn px-10 py-4 bg-black text-white text-xl flex items-center gap-4">
                   Cevabı Gönder <ArrowRight size={20}/>
                 </button>
               </div>
            </div>
          </motion.div>
        )}

        {/* PHASE 4: SONUÇ (RESULT) */}
        {phase === 'result' && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="space-y-8">
            <div className="neo-box p-12 bg-green-50 border-[6px] border-green-500 shadow-[10px_10px_0_0_rgba(34,197,94,1)] text-center flex flex-col items-center">
               <CheckCircle2 size={80} className="text-green-500 mb-6" />
               <h2 className="text-5xl font-black text-green-700 mb-4">Mükemmel!</h2>
               <p className="text-2xl font-bold font-sans text-gray-700 max-w-xl leading-relaxed">
                 "Dont" zamiri doğru seçimdi. Çünkü "avoir besoin de" kalıbıyla çalışan nesneler daima <strong className="bg-green-200">dont</strong> ile bağlanır.
               </p>
               <button onClick={() => { setPhase('catalog'); setAnswer(''); }} className="mt-12 neo-btn px-8 py-4 bg-white border-[4px] border-green-700 text-green-700 hover:bg-green-700 hover:text-white transition-colors text-xl font-bold">
                 Kataloga Dön & Yeni Modül Seç
               </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
