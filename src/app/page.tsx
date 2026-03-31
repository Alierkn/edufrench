"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#FDF9F1] overflow-hidden flex flex-col justify-center items-center">
      
      {/* Background Kinetic Lines */}
      <motion.div 
        className="absolute top-0 w-full flex justify-between px-10 h-full pointer-events-none opacity-20"
        initial={{ y: -1000 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="w-1 h-full bg-[var(--color-neo-border)]" />
        <div className="w-1 h-full bg-[var(--color-neo-border)]" />
        <div className="w-1 h-full bg-[var(--color-neo-border)]" />
        <div className="w-1 h-full bg-[var(--color-neo-border)]" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-5xl px-6">
        
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
           className="inline-block mb-8"
        >
          <span className="neo-box px-4 py-2 text-lg font-black uppercase tracking-[0.2em] neo-bg-green text-white shadow-none border-4">
             Fransız Liselerine Özel
          </span>
        </motion.div>

        <motion.h1 
          className="text-7xl md:text-9xl font-black font-serif text-[var(--color-neo-border)] leading-[0.9] tracking-tighter"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
        >
          MAÎTRISEZ<br/> <span className="text-[var(--color-neo-blue)] underline decoration-8 decoration-[var(--color-neo-yellow)] underline-offset-[16px]">LE FRANÇAIS.</span>
        </motion.h1>

        <motion.p 
          className="mt-12 text-2xl md:text-3xl font-medium font-sans text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Saint Joseph, Saint Benoît ve NDS gibi okulların akademik ritmine ayak uydurmanız için tasarlanmış **ilk ve tek Neo-Brutalist** eğitim motoru.
        </motion.p>

        <motion.div 
          className="mt-16 flex justify-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          {/* Manyetik Etkili Dev Buton */}
          <Link href="/login">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              className="neo-btn text-2xl md:text-4xl px-12 py-6 neo-bg-yellow !text-[var(--color-neo-border)] border-[6px] shadow-[12px_12px_0_0_rgba(30,30,30,1)] hover:shadow-[16px_16px_0_0_rgba(30,30,30,1)] transition-shadow cursor-pointer flex items-center gap-6"
            >
              <GraduationCap size={44} /> Sistemi Deneyimle <ArrowRight size={44} className="animate-pulse" />
            </motion.div>
          </Link>
        </motion.div>

      </div>

      {/* Deco Elements */}
      <motion.div 
        className="absolute bottom-10 left-10 w-32 h-32 neo-bg-pink border-4 border-[var(--color-neo-border)] rounded-full z-0"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-20 right-20 w-40 h-40 neo-bg-blue border-4 border-[var(--color-neo-border)] z-0 rotate-12"
        animate={{ rotate: [12, 24, 12] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
    </div>
  );
}
