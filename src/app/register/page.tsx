"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight, ShieldCheck, Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      return;
    }

    if (password.length < 10) {
      setError('Şifre en az 10 karakter olmalıdır.');
      return;
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Kayıt başarısız.');
        setIsLoading(false);
        return;
      }

      // Başarılı kayıt → Login sayfasına yönlendir
      router.push('/login?registered=true');
    } catch {
      setError('Sunucu ile bağlantı kurulamadı.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F1] flex flex-col justify-center items-center p-6">
      
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-md neo-box p-10 bg-white shadow-[12px_12px_0_0_rgba(30,30,30,1)] border-[4px] relative"
      >
         <div className="absolute -top-6 -right-6 neo-box !bg-[var(--color-neo-green)] px-4 py-2 rotate-12 font-black border-[3px] text-white">
           Yeni Kayıt
         </div>

         <div className="text-center mb-8">
            <h1 className="text-4xl font-black font-serif text-[var(--color-neo-border)] mb-2">EduFrançais</h1>
            <p className="text-gray-500 font-medium font-sans flex items-center justify-center gap-2">
               <ShieldCheck size={18} className="text-green-600" /> Güvenli Akademik Kayıt
            </p>
         </div>

         {error && (
           <div className="mb-6 p-4 bg-red-50 border-4 border-red-500 text-red-700 font-bold text-center">
             {error}
           </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-5">
            <div>
               <label className="block font-bold text-gray-700 font-sans mb-2 flex items-center gap-2"><User size={18}/> Ad Soyad</label>
               <input 
                 type="text" 
                 required
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full p-4 text-lg border-4 border-black bg-gray-50 outline-none focus:border-[var(--color-neo-blue)] focus:bg-white transition-colors font-sans"
                 placeholder="Ali Erkan"
               />
            </div>

            <div>
               <label className="block font-bold text-gray-700 font-sans mb-2 flex items-center gap-2"><Mail size={18}/> Okul E-Posta Adresi</label>
               <input 
                 type="email" 
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full p-4 text-lg border-4 border-black bg-gray-50 outline-none focus:border-[var(--color-neo-blue)] focus:bg-white transition-colors font-mono"
                 placeholder="isim@ogr.sjb.k12.tr"
               />
            </div>
            
            <div>
               <label className="block font-bold text-gray-700 font-sans mb-2 flex items-center gap-2"><Lock size={18}/> Şifre</label>
               <input 
                 type="password" 
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full p-4 text-lg border-4 border-black bg-gray-50 outline-none focus:border-[var(--color-neo-green)] focus:bg-white transition-colors font-mono tracking-widest"
                 placeholder="En az 6 karakter"
               />
            </div>

            <div>
               <label className="block font-bold text-gray-700 font-sans mb-2 flex items-center gap-2"><Lock size={18}/> Şifre Tekrarı</label>
               <input 
                 type="password" 
                 required
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 className="w-full p-4 text-lg border-4 border-black bg-gray-50 outline-none focus:border-[var(--color-neo-green)] focus:bg-white transition-colors font-mono tracking-widest"
                 placeholder="••••••••"
               />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full neo-btn text-xl !py-5 bg-black text-white flex justify-center items-center gap-3 disabled:bg-gray-400 hover:bg-gray-800 mt-4"
            >
              {isLoading ? "Hesap Oluşturuluyor..." : "Kayıt Ol"} <UserPlus />
            </button>
         </form>

         <div className="mt-8 text-center border-t-2 border-gray-200 pt-6">
            <p className="text-sm font-bold text-gray-400">Zaten hesabın var mı?</p>
            <Link href="/login" className="text-[var(--color-neo-blue)] font-bold text-lg underline hover:text-blue-700">
              Giriş Yap →
            </Link>
         </div>
      </motion.div>
    </div>
  );
}
