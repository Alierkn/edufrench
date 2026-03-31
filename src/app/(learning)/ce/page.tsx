"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BrainCircuit, Type, AlertCircle, Clock } from "lucide-react";
import { loadLearningModule } from "../actions";
import { pickExerciseForCE } from "@/lib/mapLearningModule";
import type { UnifiedExercise, UnifiedLearningModule } from "@/types/learning";

export default function CEPage() {
  const [moduleData, setModuleData] = useState<UnifiedLearningModule | null>(null);
  const [exercise, setExercise] = useState<UnifiedExercise | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await loadLearningModule("CE");
      if (cancelled) return;
      const ex = res ? pickExerciseForCE(res) : null;
      setModuleData(res);
      setExercise(ex);
      setIsLoading(false);

      if (res?.id) {
        fetch("/api/send-fomo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moduleId: res.id, action: "start" }),
        }).catch(() => {});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-2xl font-bold font-sans animate-pulse text-[var(--color-neo-border)]">
        Okuma modülü yükleniyor…
      </div>
    );
  }

  if (!moduleData || !exercise || exercise.options.length < 2) {
    return (
      <div className="p-8 neo-box bg-amber-50 text-[var(--color-neo-border)] font-sans border-[4px] space-y-4">
        <p className="font-black text-xl">Bu modül için içerik henüz hazır değil</p>
        <p className="font-bold text-gray-700">
          CE (okuma) alıştırmaları yakında eklenecek. Şimdilik başka bir modüle geçebilir veya ana sayfadan devam edebilirsin.
        </p>
        <Link
          href="/dashboard"
          className="inline-block neo-btn bg-white text-[var(--color-neo-border)] !no-underline"
        >
          Panele dön
        </Link>
      </div>
    );
  }

  const levelLabel = moduleData.level ? `Seviye ${moduleData.level}` : "";

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end mb-4 flex-wrap gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="neo-box px-3 py-1 text-sm font-bold uppercase bg-[var(--color-neo-blue)] text-white shadow-none border-2">
              CE (Okuma)
            </span>
            {levelLabel && (
              <span className="font-sans font-bold text-[var(--color-neo-border)]/60 bg-gray-200 border-2 border-[var(--color-neo-border)] px-3 py-1 rounded">
                {levelLabel}
              </span>
            )}
            <span className="flex items-center gap-1 font-bold text-gray-500 font-mono text-sm">
              <Clock size={16} /> ~15 dk
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-[var(--color-neo-border)] relative inline-block">
            {moduleData.title}
            <span className="absolute -bottom-2 left-0 w-full h-4 bg-[var(--color-neo-yellow)] -z-10 skew-x-12" />
          </h1>
        </div>
      </header>

      {moduleData.description && (
        <div className="flex items-start gap-4 p-4 neo-box bg-white !border-4 !border-[var(--color-neo-yellow)] !shadow-none">
          <BrainCircuit className="text-orange-500 shrink-0" size={32} />
          <div>
            <h4 className="font-bold font-sans">Stratégie</h4>
            <p className="font-medium text-gray-700 font-sans">{moduleData.description}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="neo-box p-6 sm:p-8 bg-[#FDF9F1] border-[4px] border-[var(--color-neo-border)] shadow-[8px_8px_0_0_rgba(30,30,30,1)]">
          <h3 className="font-bold text-xl mb-6 text-gray-400 font-sans border-b-2 pb-2 flex items-center gap-2">
            <Type size={20} /> Texte
          </h3>
          <p className="text-lg sm:text-xl font-medium font-serif leading-relaxed text-[var(--color-neo-border)] whitespace-pre-wrap">
            {exercise.content.split(/Soru\s*:/i)[0].trim()}
          </p>
        </div>

        <div className="neo-box p-6 sm:p-8 bg-white border-[4px]">
          <h3 className="text-2xl font-bold mb-6 font-sans flex items-center gap-2 bg-[var(--color-neo-yellow)] px-3 py-1 inline-block border-2 border-black rounded shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-[var(--color-neo-border)]">
            Question
          </h3>
          <p className="text-xl sm:text-2xl font-black font-sans mb-8 leading-tight">
            {/Soru\s*:/i.test(exercise.content)
              ? exercise.content.split(/Soru\s*:/i).slice(1).join("Soru:").trim()
              : "Quelle est l'idée principale du texte ?"}
          </p>

          <div className="space-y-4">
            {exercise.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => !isSubmitted && setSelectedAnswer(option.id)}
                className={`w-full text-left p-5 neo-box text-lg sm:text-xl font-bold font-sans transition-all active:scale-[0.98] ${
                  selectedAnswer === option.id
                    ? "bg-[var(--color-neo-border)] text-white shadow-[2px_2px_0_0_rgba(30,30,30,1)] translate-y-[2px] translate-x-[2px]"
                    : "bg-white hover:bg-gray-100 shadow-[6px_6px_0_0_rgba(30,30,30,1)]"
                } ${isSubmitted && option.isCorrect ? "!bg-green-400 !text-[var(--color-neo-border)] !border-4 !shadow-none translate-y-[4px] translate-x-[4px]" : ""}
                ${isSubmitted && selectedAnswer === option.id && !option.isCorrect ? "!bg-red-400 !text-white !border-4 !shadow-none" : ""}`}
                disabled={isSubmitted}
              >
                <div className="flex justify-between items-center">
                  <span>{option.text}</span>
                  {isSubmitted && selectedAnswer === option.id && !option.isCorrect && (
                    <AlertCircle className="text-white animate-bounce shrink-0 ml-2" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 flex justify-between items-center flex-wrap gap-4">
            {!isSubmitted ? (
              <button
                type="button"
                className={`neo-btn text-xl px-8 !py-4 flex items-center gap-2 ${
                  selectedAnswer
                    ? "neo-bg-green !text-[var(--color-neo-border)] hover:bg-green-300"
                    : "bg-gray-200 text-gray-400 !shadow-none cursor-not-allowed"
                }`}
                onClick={() => selectedAnswer && setIsSubmitted(true)}
                disabled={!selectedAnswer}
              >
                Vérifier <BrainCircuit size={24} />
              </button>
            ) : (
              <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in slide-in-from-bottom-2">
                <span className="font-bold text-gray-500 text-sm">
                  Sonraki içerik için modülü yeniden yükleyin veya başka bir bölüme geçin.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="font-bold flex items-center gap-2 underline text-gray-500 hover:text-black p-2 rounded transition"
                    onClick={() => window.location.reload()}
                  >
                    <ArrowLeft size={18} /> Autre texte
                  </button>
                  <a
                    href="/dashboard"
                    className="neo-btn bg-[var(--color-neo-border)] text-white text-lg px-6 flex items-center gap-2"
                  >
                    Dashboard <ArrowRight />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
