"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, CheckCircle2, Building, GraduationCap, Target, Podcast } from 'lucide-react';
import { useProgress } from '@/store/useProgress';
import { useRouter } from 'next/navigation';

export default function OnboardingFlow() {
  const router = useRouter();
  const { setUserInfo, addWeakness } = useProgress();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    grade: '',
    school: '',
    weakness: '',
    source: ''
  });

  const nextStep = () => setStep((prev) => prev + 1);

  const completeOnboarding = async () => {
    // Save to global local storage state
    setUserInfo({
      grade: answers.grade,
      school: answers.school,
      source: answers.source
    });
    // Besleme "Bugünün Odak Çalışması"
    if (answers.weakness) {
      addWeakness(answers.weakness);
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) {
        console.error("Failed to save profile:", await res.text());
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    }

    // Tam sayfa yüklemesi: JWT oturumunda okul/sınıf alanlarının güncellenmesi için
    window.location.href = "/dashboard";
  };

  const OptionButton = ({ label, field, value, icon }: { label: string, field: keyof typeof answers, value: string, icon?: React.ReactNode }) => (
    <button
      onClick={() => setAnswers({ ...answers, [field]: value })}
      className={`w-full text-left p-6 font-bold font-sans text-xl border-[4px] transition-all flex items-center gap-4 ${
        answers[field] === value 
        ? 'bg-[var(--color-neo-border)] text-white shadow-[6px_6px_0_0_rgba(30,30,30,1)] border-[var(--color-neo-border)] translate-y-[2px] translate-x-[2px]' 
        : 'bg-white hover:bg-gray-100 border-[var(--color-neo-border)] shadow-[6px_6px_0_0_rgba(30,30,30,1)]'
      }`}
    >
      <div className={`p-3 border-2 border-[var(--color-neo-border)] ${answers[field] === value ? 'bg-white text-black' : 'bg-gray-100'} rounded-full`}>
         {icon || <CheckCircle2 size={24} />}
      </div>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#FDF9F1] flex flex-col pt-12">
      {/* Progress Header */}
      <div className="w-full max-w-4xl mx-auto px-6 mb-12">
        <div className="flex justify-between font-bold font-sans text-gray-400 mb-2">
           <span className="text-[var(--color-neo-border)]">Adım {step}/4</span>
           <span>Profil Kurulumu</span>
        </div>
        <div className="h-4 w-full bg-white border-2 border-[var(--color-neo-border)]">
           <motion.div 
             className="h-full bg-[var(--color-neo-blue)] border-r-2 border-[var(--color-neo-border)]"
             initial={{ width: '0%' }}
             animate={{ width: `${(step / 4) * 100}%` }}
             transition={{ duration: 0.5, ease: "easeOut" }}
           />
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-12">
               <div>
                 <h1 className="text-5xl font-black font-serif text-[var(--color-neo-border)] mb-4">Hangi Kademedesin?</h1>
                 <p className="text-xl font-medium text-gray-500 font-sans">Sana lise müfredatına (DELF) uygun egzersizler sunabilmemiz için sınıfını bilmemiz gerekiyor.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <OptionButton label="9. Sınıf (Hazırlık Sonrası)" field="grade" value="9" icon={<GraduationCap size={28} />} />
                  <OptionButton label="10. Sınıf" field="grade" value="10" icon={<GraduationCap size={28} />} />
                  <OptionButton label="11. Sınıf" field="grade" value="11" icon={<GraduationCap size={28} />} />
                  <OptionButton label="12. Sınıf (Terminal)" field="grade" value="12" icon={<GraduationCap size={28} />} />
               </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-12">
               <div>
                 <h1 className="text-5xl font-black font-serif text-[var(--color-neo-border)] mb-4">Hangi Lisede Okuyorsun?</h1>
                 <p className="text-xl font-medium text-gray-500 font-sans">Ekol farklılıkları okuma/dinleme stillerini değiştirebilir. (Sadece sana özel listeleme için kullanılır).</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <OptionButton label="Saint Joseph lisesi" field="school" value="sjb" icon={<Building size={28} />} />
                  <OptionButton label="Saint Benoît" field="school" value="sb" icon={<Building size={28} />} />
                  <OptionButton label="Notre Dame de Sion" field="school" value="nds" icon={<Building size={28} />} />
                  <OptionButton label="Diğer (S.Michel, Charles deG.)" field="school" value="other" icon={<Building size={28} />} />
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-12">
               <div>
                 <h1 className="text-5xl font-black font-serif text-[var(--color-neo-border)] mb-4">Kabus Alanını Seç (Zayıflık)</h1>
                 <p className="text-xl font-medium text-gray-500 font-sans">Dashboard algoritmasını beslemek için en çok zorlandığın Fransızca becerisini seç. Sana oradan yardım edeceğiz.</p>
               </div>
               <div className="grid grid-cols-1 gap-6">
                  <OptionButton label="Grammaire Modülü (Dilbilgisi, Bağlaçlar)" field="weakness" value="Grammaire" icon={<Target size={28} className="text-red-500" />} />
                  <OptionButton label="Compréhension Orale (Fransızları Dinlerken Anlayamama)" field="weakness" value="Dinleme" icon={<Target size={28} className="text-pink-500" />} />
                  <OptionButton label="Production Écrite (Uzun kompozisyon yazamama)" field="weakness" value="Bağlaç" icon={<Target size={28} className="text-purple-500" />} />
                  <OptionButton label="Vocabulaire (Kelime Eksiği Çok)" field="weakness" value="Kelime" icon={<Target size={28} className="text-yellow-500" />} />
               </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-12">
               <div>
                 <h1 className="text-5xl font-black font-serif text-[var(--color-neo-border)] mb-4">Bizi Nereden Duydun?</h1>
                 <p className="text-xl font-medium text-gray-500 font-sans">EduFrancais kapalı sistem bir vizyon. Aileme hoş geldin.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <OptionButton label="Okul Arkadaşım Önerdi" field="source" value="friend" icon={<Podcast size={28} />} />
                  <OptionButton label="Öğretmenim Bahsetti" field="source" value="teacher" icon={<Podcast size={28} />} />
                  <OptionButton label="Sosyal Medya (Instagram vb.)" field="source" value="social" icon={<Podcast size={28} />} />
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 flex justify-end pb-12">
           {step < 4 ? (
             <button 
               onClick={nextStep} 
               disabled={
                 (step === 1 && !answers.grade) || 
                 (step === 2 && !answers.school) || 
                 (step === 3 && !answers.weakness)
               }
               className="neo-btn text-2xl flex items-center gap-4 bg-[var(--color-neo-yellow)] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none hover:bg-yellow-400"
             >
               Sonraki Adım <ArrowRight size={28} />
             </button>
           ) : (
             <button 
               onClick={completeOnboarding} 
               disabled={!answers.source}
               className="neo-btn text-2xl flex items-center gap-4 bg-[var(--color-neo-green)] text-white disabled:bg-gray-200 disabled:text-gray-400 hover:bg-green-600 disabled:shadow-none"
             >
               Akademik Dashborda Git <ArrowRight size={28} />
             </button>
           )}
        </div>
      </div>
    </div>
  );
}
