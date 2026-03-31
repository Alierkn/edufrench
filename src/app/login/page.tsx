"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, ShieldCheck, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      const res = await fetch("/api/user/profile");
      const data = res.ok ? await res.json() : null;
      const u = data?.user;
      const onboardingDone = Boolean(u?.grade && u?.school);
      router.push(onboardingDone ? "/dashboard" : "/onboarding");
    } else {
      setIsLoading(false);
      alert('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F1] flex flex-col justify-center items-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-md neo-box p-10 bg-white shadow-[12px_12px_0_0_rgba(30,30,30,1)] border-[4px] relative"
      >
         {/* Badge */}
         <div className="absolute -top-6 -right-6 neo-box !bg-[var(--color-neo-yellow)] px-4 py-2 rotate-12 font-black border-[3px]">
           Öğrenci Portalı
         </div>

         <div className="text-center mb-8">
            <h1 className="text-4xl font-black font-serif text-[var(--color-neo-border)] mb-2">EduFrançais</h1>
            <p className="text-gray-500 font-medium font-sans flex items-center justify-center gap-2">
               <ShieldCheck size={18} className="text-green-600" /> Güvenli Akademik Ağ
            </p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6">
            <div>
               <label className="block font-bold text-gray-700 font-sans mb-2 flex items-center gap-2"><Mail size={18}/> Okul E-Posta Adresi</label>
               <input 
                 type="email" 
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full p-4 text-xl border-4 border-black bg-gray-50 outline-none focus:border-[var(--color-neo-blue)] focus:bg-white transition-colors font-mono"
                 placeholder="isim@ogr.sjb.k12.tr"
               />
            </div>
            
            <div>
               <label className="block font-bold text-gray-700 font-sans mb-2 flex items-center gap-2"><Building2 size={18}/> Şifre (Okul No)</label>
               <input 
                 type="password" 
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full p-4 text-xl border-4 border-black bg-gray-50 outline-none focus:border-[var(--color-neo-green)] focus:bg-white transition-colors font-mono tracking-widest"
                 placeholder="••••••••"
               />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full neo-btn text-2xl !py-5 bg-black text-white flex justify-center items-center gap-3 disabled:bg-gray-400 hover:bg-gray-800"
            >
              {isLoading ? "Bağlanıyor..." : "Sisteme Giriş Yap"} <ArrowRight />
            </button>
         </form>

         <div className="mt-8 text-center border-t-2 border-gray-200 pt-6">
            <p className="text-sm font-bold text-gray-400 mb-2">Hesabınız yok mu?</p>
            <a href="/register" className="text-[var(--color-neo-blue)] font-bold text-lg underline hover:text-blue-700">
              Kayıt Ol →
            </a>
         </div>
      </motion.div>

    </div>
  );
}
