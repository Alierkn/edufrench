"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Library, ArrowRight, BrainCircuit, CheckCircle2, Loader2 } from "lucide-react";
import type { CmsExercise, CmsModule } from "@/types/cms";

const STATIC_MODULES = [
  { id: "pronoms", title: "Les Pronoms Relatifs (qui, que, où, dont)", level: "B1" },
  { id: "subjonctif", title: "Le Subjonctif Présent", level: "B2" },
  { id: "passe_compose", title: "Le Passé Composé vs Imparfait", level: "A2" },
];

type Phase = "catalog" | "theory" | "exercise" | "result";
type ActiveSource =
  | { kind: "static"; id: string }
  | { kind: "cms"; module: CmsModule }
  | null;

function pickCmsExercise(mod: CmsModule): CmsExercise | null {
  const list = mod.exercises?.filter(Boolean) ?? [];
  return (
    list.find((e) => e.exerciseType === "FILL") ||
    list.find((e) => e.exerciseType === "MCQ") ||
    null
  );
}

function correctFillAnswer(ex: CmsExercise): string {
  const opt = ex.options?.find((o) => o.isCorrect);
  return (opt?.text || "").toLowerCase().trim();
}

export default function GrammairePage() {
  const [phase, setPhase] = useState<Phase>("catalog");
  const [activeSource, setActiveSource] = useState<ActiveSource>(null);
  const [cmsExercise, setCmsExercise] = useState<CmsExercise | null>(null);
  const [cmsGrammarModules, setCmsGrammarModules] = useState<CmsModule[]>([]);
  const [cmsLoading, setCmsLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [shake, setShake] = useState(false);
  const [resultOk, setResultOk] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/content/cms-modules");
        const data = await res.json();
        const mods: CmsModule[] = Array.isArray(data.modules) ? data.modules : [];
        const g = mods.filter((m) => m.moduleType === "Grammaire");
        if (!cancelled) setCmsGrammarModules(g);
      } catch {
        if (!cancelled) setCmsGrammarModules([]);
      } finally {
        if (!cancelled) setCmsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const theoryTitle = useMemo(() => {
    if (!activeSource) return "";
    if (activeSource.kind === "cms") return activeSource.module.title;
    if (activeSource.id === "pronoms") return "Les Pronoms Relatifs";
    if (activeSource.id === "subjonctif") return "Le Subjonctif Présent";
    if (activeSource.id === "passe_compose") return "Passé Composé vs Imparfait";
    return "Grammaire";
  }, [activeSource]);

  const openStatic = (id: string) => {
    setActiveSource({ kind: "static", id });
    setCmsExercise(null);
    setAnswer("");
    setPhase("theory");
  };

  const openCms = (mod: CmsModule) => {
    setActiveSource({ kind: "cms", module: mod });
    setCmsExercise(null);
    setAnswer("");
    setPhase("theory");
  };

  const goExercise = () => {
    if (!activeSource) return;
    if (activeSource.kind === "static") {
      if (activeSource.id !== "pronoms") {
        setResultMessage("Bu örnek modülde henüz alıştırma yok. Başka bir başlık seçebilirsin.");
        setResultOk(false);
        setPhase("result");
        return;
      }
      setPhase("exercise");
      return;
    }
    const ex = pickCmsExercise(activeSource.module);
    if (!ex) {
      setResultMessage("Bu modülde henüz çoktan seçmeli veya boşluk doldurma alıştırması yok. Katalogdan başka bir konu dene.");
      setResultOk(false);
      setPhase("result");
      return;
    }
    setCmsExercise(ex);
    setPhase("exercise");
  };

  const checkAnswer = () => {
    if (!activeSource) return;

    if (activeSource.kind === "static" && activeSource.id === "pronoms") {
      if (answer.toLowerCase().trim() === "dont") {
        setResultOk(true);
        setResultMessage(
          '"Dont" zamiri doğru. "Avoir besoin de" kalıbıyla çalışan nesneler genelde dont ile bağlanır.'
        );
        setPhase("result");
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      return;
    }

    if (activeSource.kind === "cms" && cmsExercise) {
      if (cmsExercise.exerciseType === "FILL") {
        const ok = answer.toLowerCase().trim() === correctFillAnswer(cmsExercise);
        if (ok) {
          setResultOk(true);
          setResultMessage("Bravo — cevap doğru.");
        } else {
          setShake(true);
          setTimeout(() => setShake(false), 500);
        }
        return;
      }
    }
  };

  const selectMcq = (isCorrect: boolean) => {
    setResultOk(isCorrect);
    setResultMessage(isCorrect ? "Doğru şık." : "Yanlış şık; tekrar dene veya kataloga dön.");
    setPhase("result");
  };

  const resetCatalog = () => {
    setPhase("catalog");
    setActiveSource(null);
    setCmsExercise(null);
    setAnswer("");
    setResultMessage("");
  };

  return (
    <div className="space-y-8 pb-20 overflow-hidden">
      <header>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="neo-box px-3 py-1 text-sm font-bold uppercase neo-bg-green text-[var(--color-neo-border)] shadow-none border-2">
            Grammaire
          </span>
          <span className="font-sans font-bold text-[var(--color-neo-border)]/60 bg-gray-200 border-2 border-[var(--color-neo-border)] px-3 py-1 rounded">
            Katalog + örnekler
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl text-[var(--color-neo-border)] relative inline-block">
          Dilbilgisi Modülleri
          <span className="absolute -bottom-2 left-0 w-full h-4 bg-[var(--color-neo-green)] -z-10 skew-x-12" />
        </h1>
      </header>

      <AnimatePresence mode="wait">
        {phase === "catalog" && (
          <motion.div
            key="catalog"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <p className="text-lg sm:text-xl font-medium text-gray-500 font-sans mb-6">
              Güncel konu başlıkları ve yerleşik örnek alıştırmalar.
            </p>

            {cmsLoading && (
              <p className="flex items-center gap-2 text-gray-500 font-bold mb-4">
                <Loader2 className="animate-spin" size={20} /> Modül listesi yükleniyor…
              </p>
            )}

            {cmsGrammarModules.length > 0 && (
              <div className="mb-10">
                <h2 className="text-sm font-black uppercase tracking-widest text-[var(--color-neo-border)] mb-4 flex items-center gap-2">
                  <Library size={18} /> Önerilen konular
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cmsGrammarModules.map((mod) => (
                    <button
                      key={mod._id}
                      type="button"
                      onClick={() => openCms(mod)}
                      className="neo-box p-6 bg-white text-left hover:-translate-y-1 hover:bg-[var(--color-neo-yellow)]/40 transition-transform border-[4px] flex flex-col gap-2"
                    >
                      {mod.level && (
                        <span className="font-black bg-black text-white px-2 py-0.5 font-mono text-sm w-fit">
                          {mod.level}
                        </span>
                      )}
                      <h3 className="text-2xl font-serif text-[var(--color-neo-border)]">{mod.title}</h3>
                      {mod.description && (
                        <p className="text-gray-600 font-sans text-sm line-clamp-2">{mod.description}</p>
                      )}
                      <span className="font-bold text-gray-500 mt-2 flex items-center gap-2">
                        Modüle git <ArrowRight size={18} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Yerleşik démo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STATIC_MODULES.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => openStatic(mod.id)}
                  className="neo-box p-8 bg-white text-left hover:-translate-y-2 hover:bg-[var(--color-neo-yellow)] transition-transform group flex flex-col items-start gap-4 border-[4px]"
                >
                  <span className="font-black bg-black text-white px-3 py-1 font-mono text-lg">{mod.level}</span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[var(--color-neo-border)]">{mod.title}</h3>
                  <div className="mt-2 flex items-center gap-2 text-gray-500 font-bold group-hover:text-black">
                    Modüle başla <ArrowRight />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "theory" && activeSource && (
          <motion.div
            key="theory"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="space-y-8"
          >
            <button
              type="button"
              onClick={resetCatalog}
              className="font-bold underline text-gray-500 mb-4"
            >
              ← Kataloga dön
            </button>
            <div className="neo-box p-8 sm:p-10 bg-[#FDF9F1] border-[5px]">
              <h2 className="text-3xl sm:text-4xl font-black mb-6">Adım 1: Teori — {theoryTitle}</h2>

              {activeSource.kind === "cms" && (
                <div className="space-y-4 text-lg font-medium font-sans text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {activeSource.module.description ||
                    "Bu konu için teori metni henüz eklenmemiş; yine de alıştırmaya geçebilirsin."}
                </div>
              )}

              {activeSource.kind === "static" && activeSource.id === "pronoms" && (
                <div className="space-y-6 text-lg font-medium font-sans leading-relaxed text-gray-700">
                  <p>İki cümleyi bağlayan göreceli zamirler.</p>
                  <ul className="list-disc list-inside space-y-4 bg-white p-6 neo-box !border-4">
                    <li>
                      <strong className="text-blue-600">QUI:</strong> özne —{" "}
                      <em>Ce garçon qui parle…</em>
                    </li>
                    <li>
                      <strong className="text-green-600">QUE:</strong> nesne —{" "}
                      <em>Le livre que je lis…</em>
                    </li>
                    <li>
                      <strong className="text-red-600">DONT:</strong> de ile kullanılan yapılar —{" "}
                      <em>Le film dont je parle…</em>
                    </li>
                  </ul>
                </div>
              )}

              {activeSource.kind === "static" && activeSource.id === "subjonctif" && (
                <p className="text-xl text-gray-600 font-sans">
                  Subjonctif présent için kural özeti ve alıştırmalar yakında; şimdilik Studio’dan modül ekleyebilirsin.
                </p>
              )}

              {activeSource.kind === "static" && activeSource.id === "passe_compose" && (
                <p className="text-xl text-gray-600 font-sans">
                  Passé composé / imparfait ayrımı için démo metni yakında.
                </p>
              )}

              <div className="mt-10 flex justify-end">
                <button
                  type="button"
                  onClick={goExercise}
                  className="neo-btn px-8 py-4 sm:px-10 sm:py-5 bg-[var(--color-neo-blue)] text-white text-xl flex items-center gap-4"
                >
                  Pratiğe geç <ArrowRight size={26} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "exercise" && activeSource && (
          <motion.div
            key="exercise"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="space-y-8"
          >
            <button
              type="button"
              onClick={() => setPhase("theory")}
              className="font-bold underline text-gray-500 mb-4"
            >
              ← Teoriye dön
            </button>
            <div className="neo-box p-8 sm:p-10 bg-white border-[5px]">
              <div className="flex items-center gap-3 mb-6 bg-yellow-100 p-3 neo-box !border-[3px] !shadow-none">
                <BrainCircuit size={28} className="text-orange-500" />
                <h2 className="text-xl sm:text-2xl font-black text-[var(--color-neo-border)]">Adım 2: Egzersiz</h2>
              </div>

              {activeSource.kind === "static" && activeSource.id === "pronoms" && (
                <>
                  <p className="text-gray-500 font-bold mb-6 text-lg">
                    Doğru zamiri yazarak boşluğu doldur.
                  </p>
                  <div className="bg-gray-50 p-6 sm:p-8 neo-box border-[4px] border-[var(--color-neo-border)] flex flex-wrap items-center gap-3 text-2xl sm:text-3xl font-serif">
                    Le dictionnaire
                    <motion.input
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      animate={shake ? { x: [-10, 10, -10, 10, 0], backgroundColor: ["#fee2e2", "#ffffff"] } : {}}
                      transition={{ duration: 0.4 }}
                      className="min-w-[6rem] max-w-[10rem] bg-white border-b-4 border-black text-center font-bold outline-none focus:border-[var(--color-neo-yellow)]"
                      placeholder="???"
                    />
                    j&apos;ai besoin.
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <p className="text-gray-400 font-bold font-sans text-sm">İpucu: avoir besoin DE</p>
                    <button
                      type="button"
                      onClick={checkAnswer}
                      className="neo-btn px-8 py-4 bg-black text-white text-lg flex items-center gap-3"
                    >
                      Gönder <ArrowRight size={20} />
                    </button>
                  </div>
                </>
              )}

              {activeSource.kind === "cms" && cmsExercise?.exerciseType === "FILL" && (
                <>
                  <p className="text-gray-600 font-sans mb-6 whitespace-pre-wrap">{cmsExercise.content}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xl font-serif">
                    <span className="text-gray-500 font-bold">Cevabın:</span>
                    <motion.input
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      animate={shake ? { x: [-10, 10, 0], backgroundColor: ["#fee2e2", "#ffffff"] } : {}}
                      transition={{ duration: 0.35 }}
                      className="flex-1 min-w-[8rem] bg-gray-50 border-b-4 border-black px-2 py-2 font-bold outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={checkAnswer}
                    className="mt-8 neo-btn px-8 py-4 bg-black text-white"
                  >
                    Kontrol et
                  </button>
                </>
              )}

              {activeSource.kind === "cms" && cmsExercise?.exerciseType === "MCQ" && cmsExercise.options && (
                <>
                  <p className="text-gray-700 font-sans text-lg mb-6 whitespace-pre-wrap">{cmsExercise.content}</p>
                  <div className="grid gap-3">
                    {cmsExercise.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectMcq(Boolean(opt.isCorrect))}
                        className="neo-box p-4 text-left font-bold border-[3px] hover:bg-[var(--color-neo-yellow)]/40 transition-colors"
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div
              className={`neo-box p-10 sm:p-12 border-[6px] text-center flex flex-col items-center ${
                resultOk
                  ? "bg-green-50 border-green-500 shadow-[10px_10px_0_0_rgba(34,197,94,1)]"
                  : "bg-amber-50 border-amber-600 shadow-[10px_10px_0_0_rgba(217,119,6,1)]"
              }`}
            >
              <CheckCircle2 size={72} className={resultOk ? "text-green-500 mb-4" : "text-amber-600 mb-4"} />
              <h2 className="text-3xl sm:text-5xl font-black mb-4 text-[var(--color-neo-border)]">
                {resultOk ? "Bravo !" : "Bilgi"}
              </h2>
              <p className="text-lg sm:text-2xl font-bold font-sans text-gray-700 max-w-xl leading-relaxed">
                {resultMessage}
              </p>
              <button
                type="button"
                onClick={resetCatalog}
                className="mt-10 neo-btn px-8 py-4 bg-white border-[4px] border-[var(--color-neo-border)] text-lg font-bold"
              >
                Kataloga dön
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
