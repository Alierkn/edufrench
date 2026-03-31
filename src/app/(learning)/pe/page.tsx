"use client";

import { useState, useEffect } from "react";
import { PenTool, BrainCircuit, Type, FileText, Loader2, AlertCircle } from "lucide-react";
import { loadLearningModule } from "../actions";
import { pickPromptForPE } from "@/lib/mapLearningModule";
import type { UnifiedLearningModule } from "@/types/learning";

export default function PEPage() {
  const [moduleData, setModuleData] = useState<UnifiedLearningModule | null>(null);
  const [instructions, setInstructions] = useState("");
  const [title, setTitle] = useState("Production écrite");
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [scoreLabel, setScoreLabel] = useState<string | null>(null);

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const m = await loadLearningModule("PE");
      if (cancelled) return;
      if (m) {
        const p = pickPromptForPE(m);
        setModuleData(m);
        setTitle(p.title);
        setInstructions(p.instructions);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const runAiEvaluation = async () => {
    if (!moduleData || wordCount < 40) return;
    setAiLoading(true);
    setFeedback(null);
    setScoreLabel(null);
    try {
      const res = await fetch("/api/ai-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          level: moduleData.level,
          promptTitle: `${title} — ${instructions.slice(0, 200)}`,
        }),
      });
      const data = await res.json();
      if (data.feedback) {
        setFeedback(data.feedback);
        setScoreLabel(data.score ?? null);
      } else {
        setFeedback(data.error || "Analiz alınamadı.");
      }
    } catch {
      setFeedback("Ağ hatası. Tekrar deneyin.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = () => {
    if (wordCount < 40) return;
    setIsSubmitted(true);
    void runAiEvaluation();
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3 text-xl font-bold">
        <Loader2 className="animate-spin text-[var(--color-neo-purple)]" /> PE konusu yükleniyor…
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="p-8 neo-box bg-amber-50 border-[4px] font-bold text-amber-900">
        PE modülü bulunamadı. Sanity’de <code className="font-mono">moduleType: PE</code> veya Prisma’da içerik ekleyin.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <header>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="neo-box px-3 py-1 text-sm font-bold uppercase neo-bg-purple text-white shadow-none border-2">
            PE (Yazma)
          </span>
          <span className="font-sans font-bold text-[var(--color-neo-border)]/60 bg-gray-200 border-2 border-[var(--color-neo-border)] px-3 py-1 rounded text-sm">
            {moduleData.level} • {moduleData.source === "cms" ? "Sanity" : "Prisma"}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl text-[var(--color-neo-border)] relative inline-block">{title}</h1>
      </header>

      <div className="neo-box p-6 sm:p-8 bg-purple-50 flex items-start gap-4 border-[4px]">
        <FileText size={36} className="text-[var(--color-neo-purple)] shrink-0" />
        <div>
          <h4 className="font-bold text-xl mb-2 font-sans">Sujet</h4>
          <p className="text-base sm:text-lg font-medium text-gray-800 font-sans leading-relaxed whitespace-pre-wrap">
            {instructions}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="neo-box p-0 bg-white overflow-hidden focus-within:ring-4 focus-within:ring-[var(--color-neo-purple)]/30 transition-shadow border-[3px] border-[var(--color-neo-border)]">
          <div className="bg-gray-100 border-b-4 border-[var(--color-neo-border)] p-4 flex flex-wrap justify-between items-center gap-2 font-bold font-sans text-lg">
            <span className="flex items-center gap-2">
              <PenTool size={20} /> Éditeur
            </span>
            <span
              className={`${wordCount < 100 ? "text-orange-500" : "text-green-600"} flex items-center gap-1`}
            >
              <Type size={20} /> {wordCount} mots (cible ~100–150)
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => !isSubmitted && setText(e.target.value)}
            disabled={isSubmitted}
            placeholder="Écrivez votre texte ici…"
            className="w-full min-h-[280px] sm:min-h-[350px] p-6 text-lg sm:text-xl font-sans resize-y focus:outline-none bg-transparent disabled:bg-gray-50 leading-relaxed"
          />
        </div>

        {wordCount > 0 && wordCount < 40 && (
          <p className="text-sm font-bold text-orange-600 flex items-center gap-2">
            <AlertCircle size={18} /> En az ~40 kelime yazın; AI analizi için yeterli bağlam gerekir.
          </p>
        )}

        {!isSubmitted ? (
          <div className="flex justify-end mt-6">
            <button
              type="button"
              className={`neo-btn text-xl px-10 py-5 flex items-center gap-3 ${
                wordCount >= 40
                  ? "neo-bg-green !text-[var(--color-neo-border)] hover:bg-green-400"
                  : "bg-gray-200 text-gray-400 !shadow-none cursor-not-allowed"
              }`}
              onClick={handleSubmit}
              disabled={wordCount < 40}
            >
              Envoyer à l&apos;IA <BrainCircuit size={28} />
            </button>
          </div>
        ) : (
          <div className="neo-box p-8 sm:p-10 bg-[#FDF9F1] border-[4px] border-[var(--color-neo-border)] mt-8 shadow-[10px_10px_0_0_rgba(30,30,30,1)]">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 font-sans flex items-center gap-3 text-[var(--color-neo-border)]">
              <BrainCircuit className="text-[var(--color-neo-purple)]" size={36} />
              Retour (OpenAI)
            </h3>

            {aiLoading && (
              <div className="flex items-center gap-3 text-lg font-bold text-gray-600 py-8">
                <Loader2 className="animate-spin" /> Analyse en cours…
              </div>
            )}

            {!aiLoading && feedback && (
              <div className="bg-white neo-box p-6 sm:p-8 !border-[3px] space-y-4">
                {scoreLabel && (
                  <p className="font-black text-[var(--color-neo-purple)] text-lg">{scoreLabel}</p>
                )}
                <div className="font-sans text-base sm:text-lg text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {feedback}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                className="neo-btn bg-white hover:bg-gray-100 flex items-center gap-2 text-lg !py-3"
                onClick={() => {
                  setIsSubmitted(false);
                  setFeedback(null);
                  setScoreLabel(null);
                }}
              >
                <PenTool size={20} /> Modifier le brouillon
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
