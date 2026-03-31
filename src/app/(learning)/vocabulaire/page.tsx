"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowRight, ArrowLeft, BrainCircuit, BookOpen, Loader2 } from "lucide-react";
import type { VocabCard, VocabTopic } from "@/types/cms";

const DEMO_CARDS: VocabCard[] = [
  {
    frontFr: "Cependant",
    backTr: "Bununla birlikte, ancak",
    example: "Il a étudié très dur, cependant il a échoué à l'examen.",
  },
  {
    frontFr: "Démarche",
    backTr: "Yöntem, adım, yaklaşım",
    example: "La démarche scientifique est essentielle pour l'avenir.",
  },
  {
    frontFr: "Néanmoins",
    backTr: "Yine de",
    example: "C'est un sujet difficile, néanmoins nous allons essayer.",
  },
  {
    frontFr: "Atout",
    backTr: "Avantaj, koz",
    example: "Parler plusieurs langues est un atout majeur dans le monde du travail.",
  },
];

const DEMO_TOPIC: VocabTopic = {
  _id: "local-demo",
  title: "Démo — Connecteurs & académique (hors CMS)",
  summary: "Örnek kelime seti — diğer konular yüklendiğinde listede görünür.",
  level: "B1",
  cards: DEMO_CARDS,
};

function normalizeCards(cards: VocabCard[] | null | undefined): VocabCard[] {
  if (!cards?.length) return [];
  return cards.filter((c) => c.frontFr?.trim() && c.backTr?.trim());
}

export default function VocabulairePage() {
  const [phase, setPhase] = useState<"catalog" | "practice">("catalog");
  const [topics, setTopics] = useState<VocabTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState<VocabTopic | null>(null);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/content/vocab-topics");
        const data = await res.json();
        const list: VocabTopic[] = Array.isArray(data.topics) ? data.topics : [];
        if (!cancelled) {
          const withCards = list.filter((t) => normalizeCards(t.cards).length > 0);
          setTopics(withCards.length ? withCards : [DEMO_TOPIC]);
        }
      } catch {
        if (!cancelled) setTopics([DEMO_TOPIC]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = useMemo(() => {
    if (!activeTopic) return DEMO_CARDS;
    const n = normalizeCards(activeTopic.cards);
    return n.length ? n : DEMO_CARDS;
  }, [activeTopic]);

  const card = cards[index] ?? cards[0];

  const startTopic = (t: VocabTopic) => {
    const n = normalizeCards(t.cards);
    if (!n.length && t._id !== DEMO_TOPIC._id) return;
    setActiveTopic(t);
    setIndex(0);
    setIsFlipped(false);
    setPhase("practice");
  };

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  }, [cards.length]);

  return (
    <div className="space-y-8 pb-20 overflow-hidden">
      <header>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="neo-box px-3 py-1 text-sm font-bold uppercase neo-bg-yellow text-[var(--color-neo-border)] border-2">
            Vocabulaire
          </span>
          <span className="font-sans font-bold text-gray-600 bg-white border-2 border-[var(--color-neo-border)] px-3 py-1 rounded">
            Kartlar
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl text-[var(--color-neo-border)]">Kelime Kasası</h1>
        <p className="mt-3 text-lg font-medium text-gray-500 font-sans max-w-2xl">
          Konu seç, kartları çevir; listeler sınıfına ve okuluna göre uyarlanır.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {phase === "catalog" && (
          <motion.div
            key="catalog"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {loading ? (
              <div className="flex items-center gap-3 text-gray-500 font-bold font-sans">
                <Loader2 className="animate-spin" size={24} />
                Konular yükleniyor…
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topics.map((t) => {
                  const count = normalizeCards(t.cards).length || (t._id === DEMO_TOPIC._id ? DEMO_CARDS.length : 0);
                  return (
                    <button
                      key={t._id}
                      type="button"
                      onClick={() => startTopic(t)}
                      className="neo-box p-6 bg-white text-left hover:-translate-y-1 hover:bg-[var(--color-neo-yellow)]/30 transition-transform border-[4px] flex flex-col gap-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {t.level && (
                          <span className="font-black bg-black text-white px-2 py-0.5 font-mono text-sm">{t.level}</span>
                        )}
                        <span className="text-xs font-bold text-gray-500 uppercase">{count} kart</span>
                      </div>
                      <h2 className="text-2xl font-serif font-black text-[var(--color-neo-border)]">{t.title}</h2>
                      {t.summary && <p className="text-gray-600 font-sans font-medium line-clamp-3">{t.summary}</p>}
                      <span className="font-bold text-[var(--color-neo-blue)] flex items-center gap-2 mt-2">
                        <BookOpen size={18} /> Çalışmaya başla <ArrowRight size={18} />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {phase === "practice" && activeTopic && card && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex flex-col items-center mt-8 mx-auto max-w-2xl px-2 sm:px-4"
          >
            <button
              type="button"
              onClick={() => {
                setPhase("catalog");
                setActiveTopic(null);
                setIsFlipped(false);
              }}
              className="self-start mb-6 font-bold underline text-gray-500 hover:text-black"
            >
              ← Konu listesi
            </button>
            <p className="text-sm font-bold text-gray-400 mb-4 font-sans w-full text-center">{activeTopic.title}</p>

            <div className="flex items-center gap-2 mb-8 flex-wrap justify-center">
              {cards.map((_, i) => (
                <div
                  key={i}
                  className={`h-3 w-8 sm:w-12 border-2 border-[var(--color-neo-border)] ${
                    i <= index ? "bg-[var(--color-neo-blue)]" : "bg-white"
                  }`}
                />
              ))}
            </div>

            <div className="relative w-full h-[320px] sm:h-[380px]" style={{ perspective: "1200px" }}>
              <motion.div
                className="w-full h-full relative cursor-pointer group"
                onClick={() => setIsFlipped(!isFlipped)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="absolute w-full h-full neo-box border-[6px] bg-white flex flex-col items-center justify-center p-6 sm:p-8 text-center"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="text-sm font-bold bg-[#FDF9F1] px-4 py-1 rounded border-2 border-[var(--color-neo-border)] absolute top-4 sm:top-6 right-4 sm:right-6 font-sans">
                    {activeTopic.title.length > 28 ? "Vocabulaire" : activeTopic.title}
                  </span>
                  <button
                    type="button"
                    className="absolute top-4 sm:top-6 left-4 sm:left-6 p-3 rounded-full hover:bg-[var(--color-neo-yellow)] transition-colors border-2 border-[var(--color-neo-border)] bg-gray-50 flex items-center justify-center neo-box !shadow-sm"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Ses (yakında)"
                  >
                    <Volume2 size={22} />
                  </button>
                  <h2 className="text-5xl sm:text-7xl font-serif text-[var(--color-neo-border)] mt-10 group-hover:scale-105 transition-transform break-words px-2">
                    {card.frontFr}
                  </h2>
                  <div className="absolute bottom-6 sm:bottom-8 text-gray-400 font-bold flex items-center gap-2 font-sans bg-gray-100 px-4 sm:px-6 py-2 rounded-full border-2 border-gray-300 text-sm sm:text-base">
                    Çevirmek için karta tıkla <ArrowRight size={18} className="animate-pulse text-[var(--color-neo-border)]" />
                  </div>
                </div>

                <div
                  className="absolute w-full h-full neo-box border-[6px] bg-[var(--color-neo-purple)] flex flex-col items-center justify-center p-6 sm:p-8 text-center text-white"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <span className="text-sm font-bold bg-white/20 px-4 py-1 rounded border-2 border-white absolute top-4 sm:top-6 right-4 sm:right-6 font-sans">
                    Türkçe
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-sans font-black mb-6 underline decoration-4 decoration-[var(--color-neo-yellow)] underline-offset-8 px-2">
                    {card.backTr}
                  </h2>
                  {card.example && (
                    <div className="bg-white text-[var(--color-neo-border)] p-4 sm:p-6 neo-box !border-4 !shadow-[4px_4px_0_0_rgba(255,255,255,0.3)] w-full max-h-[40%] overflow-y-auto">
                      <p className="font-serif italic text-lg sm:text-2xl text-left leading-relaxed">&ldquo;{card.example}&rdquo;</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="w-full mt-8 flex gap-3 justify-center">
              <button
                type="button"
                onClick={handlePrev}
                className="neo-btn px-6 py-3 bg-white border-[3px] font-bold flex items-center gap-2"
              >
                <ArrowLeft size={20} /> Önceki
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="neo-btn px-6 py-3 bg-[var(--color-neo-blue)] text-white border-[3px] font-bold flex items-center gap-2"
              >
                Sonraki <ArrowRight size={20} />
              </button>
            </div>

            <div className="w-full mt-8 p-6 bg-white neo-box !border-[4px] flex flex-col items-center">
              <h4 className="font-bold text-gray-500 mb-4 font-sans uppercase tracking-wider text-sm flex items-center gap-2">
                <BrainCircuit size={18} /> Kendi değerlendirmen
              </h4>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 neo-btn !py-3 bg-red-100 hover:bg-red-200 border-[3px] text-red-700 font-bold"
                >
                  Zor — tekrar
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 neo-btn !py-3 bg-blue-100 hover:bg-blue-200 border-[3px] text-blue-700 font-bold"
                >
                  Orta
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 neo-btn !py-3 bg-green-100 hover:bg-green-200 border-[3px] text-green-700 font-bold"
                >
                  Kolay — geç
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
