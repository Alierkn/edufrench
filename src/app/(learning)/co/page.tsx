"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, AlertCircle, Headphones, Loader2 } from "lucide-react";
import { loadLearningModule } from "../actions";
import { pickExerciseForCO } from "@/lib/mapLearningModule";
import type { UnifiedExercise, UnifiedLearningModule } from "@/types/learning";

export default function COPage() {
  const [moduleData, setModuleData] = useState<UnifiedLearningModule | null>(null);
  const [exercise, setExercise] = useState<UnifiedExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const m = await loadLearningModule("CO");
      if (cancelled) return;
      setModuleData(m);
      setExercise(m ? pickExerciseForCO(m) : null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      if (a.duration && !Number.isNaN(a.duration)) {
        setProgress((a.currentTime / a.duration) * 100);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, [exercise?.mediaUrl]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.pause();
    } else {
      void a.play().catch(() => setIsPlaying(false));
    }
  };

  const seekBarClick = (e: React.MouseEvent<HTMLElement>) => {
    const a = audioRef.current;
    if (!a?.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    a.currentTime = pct * a.duration;
    setProgress(pct * 100);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3 text-xl font-bold text-[var(--color-neo-border)]">
        <Loader2 className="animate-spin" /> CO modülü yükleniyor…
      </div>
    );
  }

  if (!moduleData || !exercise || exercise.options.length < 2) {
    return (
      <div className="p-8 neo-box bg-amber-50 text-amber-900 font-bold border-[4px]">
        CO içeriği yok. Sanity’de <code className="font-mono">moduleType: CO</code>, ses dosyalı egzersiz ve şıklar ekleyin veya Prisma seed kullanın.
      </div>
    );
  }

  const hasAudio = Boolean(exercise.mediaUrl);
  const transcript =
    exercise.content.split(/Soru\s*:|Question\s*:/i)[0].trim() || exercise.content;
  const questionPart = /Soru\s*:|Question\s*:/i.test(exercise.content)
    ? exercise.content.split(/Soru\s*:|Question\s*:/i).slice(1).join(" ").trim()
    : "Écoutez et choisissez la bonne réponse.";

  return (
    <div className="space-y-8 pb-20">
      <header>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="neo-box px-3 py-1 text-sm font-bold uppercase bg-[var(--color-neo-pink)] text-white shadow-none border-2">
            CO (Dinleme)
          </span>
          <span className="font-sans font-bold text-[var(--color-neo-border)]/60 bg-gray-200 border-2 border-[var(--color-neo-border)] px-3 py-1 rounded text-sm">
            {moduleData.level} • {moduleData.source === "cms" ? "Sanity" : "Prisma"}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl text-[var(--color-neo-border)] relative inline-block">
          {moduleData.title}
          <span className="absolute -bottom-2 left-0 w-full h-4 bg-[var(--color-neo-yellow)] -z-10 skew-x-12" />
        </h1>
      </header>

      {hasAudio && (
        <audio ref={audioRef} src={exercise.mediaUrl!} preload="metadata" className="hidden" />
      )}

      <div className="neo-box p-6 sm:p-8 bg-blue-50 border-[4px] border-[var(--color-neo-border)] shadow-[6px_6px_0_0_rgba(30,30,30,1)] flex flex-col sm:flex-row sm:items-center gap-6">
        {hasAudio ? (
          <>
            <button
              type="button"
              onClick={togglePlay}
              className="w-[72px] h-[72px] shrink-0 rounded-full bg-[var(--color-neo-blue)] neo-box !border-4 !rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause size={36} className="fill-current" />
              ) : (
                <Play size={36} className="ml-1 fill-current" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between mb-3 font-bold font-sans text-lg text-[var(--color-neo-border)]">
                <span className="flex items-center gap-2">
                  <Headphones size={22} />
                  {isPlaying ? "Lecture…" : progress >= 99 ? "Terminé" : "Piste audio"}
                </span>
                <span className="font-mono text-sm">
                  {audioRef.current && !Number.isNaN(audioRef.current.duration)
                    ? `${Math.floor(audioRef.current.currentTime)}s / ${Math.floor(audioRef.current.duration)}s`
                    : "—"}
                </span>
              </div>
              <button
                type="button"
                className="h-6 w-full bg-white neo-box !border-2 !p-0 overflow-hidden relative cursor-pointer block"
                onClick={seekBarClick}
                aria-label="Barre de progression"
              >
                <div
                  className="h-full bg-[var(--color-neo-purple)] transition-[width] duration-100 ease-linear border-r-2 border-[var(--color-neo-border)]"
                  style={{ width: `${progress}%` }}
                />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-start gap-4 text-[var(--color-neo-border)]">
            <AlertCircle className="shrink-0 text-orange-500" size={32} />
            <p className="font-sans font-medium">
              Bu egzersizde ses URL’si yok. Aşağıdaki transkripti okuyarak soruyu yanıtlayın; Studio’da egzersize ses dosyası ekleyebilirsiniz.
            </p>
          </div>
        )}
      </div>

      {moduleData.description && (
        <div className="neo-box p-6 bg-white flex items-start gap-4 border-[3px]">
          <AlertCircle size={28} className="text-orange-500 shrink-0" />
          <p className="text-lg font-medium text-gray-700 font-sans">{moduleData.description}</p>
        </div>
      )}

      <div className="neo-box p-6 sm:p-8 bg-[#F3F4F6] border-[4px] border-[var(--color-neo-border)]">
        <h3 className="text-lg font-bold mb-4 font-sans text-gray-600 uppercase tracking-wide">
          Transcription / support
        </h3>
        <p className="text-base sm:text-lg font-serif text-[var(--color-neo-border)] whitespace-pre-wrap mb-8 leading-relaxed">
          {transcript}
        </p>

        <h3 className="text-xl sm:text-2xl font-bold mb-4 font-sans text-[var(--color-neo-border)] bg-gray-200 px-4 py-2 inline-block rounded neo-box !border-2 !shadow-sm">
          Question
        </h3>
        <p className="text-xl sm:text-2xl font-black font-sans mb-8">{questionPart}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercise.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => !isSubmitted && setSelected(option.id)}
              className={`w-full text-left p-5 sm:p-6 neo-box text-lg font-bold font-sans transition-all ${
                selected === option.id
                  ? "bg-[var(--color-neo-border)] text-white shadow-[2px_2px_0_0_rgba(30,30,30,1)] translate-y-[2px] translate-x-[2px]"
                  : "bg-white hover:bg-gray-100"
              } ${isSubmitted && option.isCorrect ? "!bg-green-400 !text-[var(--color-neo-border)] !border-4" : ""}
              ${isSubmitted && selected === option.id && !option.isCorrect ? "!bg-red-400 !text-white !border-4" : ""}`}
              disabled={isSubmitted}
            >
              {option.text}
            </button>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          {!isSubmitted ? (
            <button
              type="button"
              className={`neo-btn text-xl px-10 py-4 ${
                selected
                  ? "neo-bg-green !text-[var(--color-neo-border)] hover:bg-green-300"
                  : "bg-gray-200 text-gray-400 !shadow-none cursor-not-allowed"
              }`}
              onClick={() => selected && setIsSubmitted(true)}
              disabled={!selected}
            >
              Valider
            </button>
          ) : (
            <div className="w-full neo-box p-4 bg-yellow-50 font-bold text-[var(--color-neo-border)]">
              {hasAudio ? "Réécoutez la piste pour les détails." : "Consultez la transcription ci-dessus."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
