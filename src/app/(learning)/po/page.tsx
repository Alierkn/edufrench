"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Mic, Square, Download, Headphones, Loader2, AlertCircle, Send } from "lucide-react";
import { loadLearningModule } from "../actions";
import { pickPromptForPO } from "@/lib/mapLearningModule";
import type { UnifiedLearningModule } from "@/types/learning";

const MAX_SECONDS = 120;

export default function POPage() {
  const [moduleData, setModuleData] = useState<UnifiedLearningModule | null>(null);
  const [title, setTitle] = useState("Expression orale");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(true);

  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MAX_SECONDS);
  const [isFinished, setIsFinished] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitOk, setSubmitOk] = useState<string | null>(null);
  const [submitErr, setSubmitErr] = useState<string | null>(null);
  const [lastDurationSec, setLastDurationSec] = useState(0);

  const chunksRef = useRef<BlobPart[]>([]);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeLeftRef = useRef(MAX_SECONDS);
  const lastBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const m = await loadLearningModule("PO");
      if (cancelled) return;
      if (m) {
        const p = pickPromptForPO(m);
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

  const stopRecording = useCallback(() => {
    if (mediaRecRef.current?.state === "recording") {
      mediaRecRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsRecording(false);
  }, []);

  useEffect(() => {
    if (!isRecording) return;
    const id = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRecording]);

  useEffect(() => {
    if (timeLeft !== 0 || !isRecording) return;
    stopRecording();
  }, [timeLeft, isRecording, stopRecording]);

  useEffect(() => {
    return () => {
      stopRecording();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl, stopRecording]);

  const startRecording = async () => {
    setMicError(null);
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

      const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      mediaRecRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        lastBlobRef.current = blob;
        const elapsed = Math.min(MAX_SECONDS, Math.max(1, MAX_SECONDS - timeLeftRef.current));
        setLastDurationSec(elapsed);
        setBlobUrl(URL.createObjectURL(blob));
        setIsFinished(true);
        setSubmitOk(null);
        setSubmitErr(null);
      };

      mr.start(200);
      setTimeLeft(MAX_SECONDS);
      setIsFinished(false);
      setIsRecording(true);
    } catch {
      setMicError("Mikrofon erişimi reddedildi veya cihaz desteklenmiyor.");
    }
  };

  const toggleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      void startRecording();
    }
  };

  const submitToPortal = async () => {
    if (!moduleData) return;
    setSubmitLoading(true);
    setSubmitErr(null);
    setSubmitOk(null);
    const blob = lastBlobRef.current;
    const firstEx = moduleData.exercises[0];
    try {
      const res = await fetch("/api/submissions/po", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: moduleData.id,
          moduleSource: moduleData.source,
          durationSeconds: lastDurationSec || Math.min(MAX_SECONDS, MAX_SECONDS - timeLeftRef.current),
          exerciseId: firstEx?.id,
          audioMimeType: blob?.type,
          audioByteLength: blob?.size,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitErr(typeof data.error === "string" ? data.error : "Kayıt başarısız");
        return;
      }
      setSubmitOk(
        typeof data.message === "string" ? data.message : "Gönderim kaydedildi. Öğretmen panelinden görülebilir."
      );
    } catch {
      setSubmitErr("Ağ hatası");
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3 text-xl font-bold">
        <Loader2 className="animate-spin text-[var(--color-neo-green)]" /> PO konusu yükleniyor…
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="p-8 neo-box bg-amber-50 border-[4px] font-sans text-[var(--color-neo-border)] space-y-4">
        <p className="font-black text-xl">Konuşma pratiği henüz açılmadı</p>
        <p className="font-bold text-gray-700">
          Bu alan için konu başlıkları eklendiğinde kayıt yapabileceksin. Şimdilik dinleme veya okuma modülüne geçebilirsin.
        </p>
        <Link href="/dashboard" className="inline-block neo-btn bg-white !no-underline">
          Panele dön
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <header>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="neo-box px-3 py-1 text-sm font-bold uppercase neo-bg-green text-white shadow-none border-2">
            PO (Konuşma)
          </span>
          {moduleData.level && (
            <span className="font-sans font-bold text-[var(--color-neo-border)]/60 bg-gray-200 border-2 border-[var(--color-neo-border)] px-3 py-1 rounded text-sm">
              Seviye {moduleData.level}
            </span>
          )}
        </div>
        <h1 className="text-4xl sm:text-5xl text-[var(--color-neo-border)] relative inline-block">
          {title}
          <span className="absolute -bottom-2 left-0 w-full h-4 bg-[var(--color-neo-green)] -z-10 skew-x-12" />
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="col-span-1 lg:col-span-2 space-y-8">
          <div className="neo-box p-8 bg-white shadow-[8px_8px_0_0_rgba(30,30,30,1)] border-[4px]">
            <h3 className="font-bold text-2xl mb-4 text-gray-400 font-sans border-b-2 pb-2">Sujet</h3>
            <p className="text-xl sm:text-2xl font-serif font-black text-[var(--color-neo-border)] leading-tight mb-6 whitespace-pre-wrap">
              {instructions}
            </p>
            <p className="text-lg font-medium font-sans text-gray-700">
              Environ 2 minutes. Utilisez des exemples concrets. Enregistrement maximal {MAX_SECONDS}s.
            </p>
          </div>

          {micError && (
            <div className="neo-box p-4 bg-red-50 border-[3px] border-red-400 flex items-center gap-3 text-red-800 font-bold">
              <AlertCircle /> {micError}
            </div>
          )}

          <div
            className={`neo-box p-10 sm:p-16 flex flex-col items-center justify-center transition-colors duration-500 border-[6px] ${
              isRecording
                ? "bg-red-50 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.25)]"
                : isFinished
                  ? "bg-green-50 border-green-500"
                  : "bg-[#F3F4F6] border-[var(--color-neo-border)]"
            }`}
          >
            <div className="text-5xl sm:text-7xl font-mono font-black mb-8 tabular-nums flex items-center gap-4">
              {formatTime(isRecording ? timeLeft : isFinished ? 0 : MAX_SECONDS)}
            </div>

            {!isFinished ? (
              <button
                type="button"
                onClick={toggleRecord}
                className={`flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-black text-xl sm:text-2xl transition-all ${
                  isRecording
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-red-500 text-white hover:bg-red-600 shadow-[6px_6px_0_0_rgba(30,30,30,1)] hover:translate-y-1 hover:shadow-none border-4 border-[var(--color-neo-border)]"
                }`}
              >
                {isRecording ? (
                  <>
                    <Square size={28} className="fill-current animate-pulse" /> Arrêter
                  </>
                ) : (
                  <>
                    <Mic size={28} /> Enregistrer
                  </>
                )}
              </button>
            ) : (
              <div className="flex flex-col gap-4 w-full max-w-lg">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="neo-btn !bg-white text-lg flex items-center justify-center gap-2"
                    onClick={() => {
                      if (blobUrl) URL.revokeObjectURL(blobUrl);
                      setBlobUrl(null);
                      lastBlobRef.current = null;
                      setIsFinished(false);
                      setTimeLeft(MAX_SECONDS);
                      setSubmitOk(null);
                      setSubmitErr(null);
                    }}
                  >
                    <Mic size={20} /> Recommencer
                  </button>
                  {blobUrl && (
                    <a
                      href={blobUrl}
                      download={`po-${moduleData.id}.webm`}
                      className="neo-btn neo-bg-blue !text-white text-lg flex items-center justify-center gap-2"
                    >
                      <Download size={20} /> Télécharger
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  disabled={submitLoading}
                  onClick={() => void submitToPortal()}
                  className="neo-btn bg-[var(--color-neo-border)] text-white text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitLoading ? (
                    <Loader2 className="animate-spin" size={22} />
                  ) : (
                    <Send size={22} />
                  )}
                  Portail&apos;e kaydet (süre + sujet)
                </button>
                {submitOk && (
                  <p className="text-green-700 font-bold text-sm neo-box p-3 bg-green-50 border-[2px] border-green-600">
                    {submitOk}
                  </p>
                )}
                {submitErr && (
                  <p className="text-red-700 font-bold text-sm neo-box p-3 bg-red-50 border-[2px] border-red-500">
                    {submitErr}
                  </p>
                )}
              </div>
            )}

            {blobUrl && isFinished && (
              <div className="mt-8 w-full max-w-lg neo-box p-4 bg-white border-[3px]">
                <p className="font-bold text-sm text-gray-500 mb-2 flex items-center gap-2">
                  <Headphones size={18} /> Écoute
                </p>
                <audio src={blobUrl} controls className="w-full" />
              </div>
            )}

            {isRecording && (
              <p className="mt-8 text-red-600 font-bold text-center animate-pulse">
                Enregistrement en cours… ({timeLeft}s restantes)
              </p>
            )}
          </div>

          <p className="text-sm text-gray-500 font-sans">
            « Portail&apos;e kaydet » süre ve konu bilgisini veritabanına yazar. Ses dosyası cihazınızda kalır;
            ileride blob / ElevenLabs ile <code className="font-mono text-xs">mediaUrl</code> doldurulabilir.
          </p>
        </div>

        <div className="col-span-1 space-y-8">
          <div className="neo-box p-8 bg-yellow-50 !border-[4px]">
            <h4 className="font-black text-2xl mb-6 font-sans border-b-4 border-[var(--color-neo-border)] inline-block pb-1">
              Connecteurs
            </h4>
            <ul className="space-y-3 font-bold font-sans text-lg">
              {["À mon avis…", "D’une part…", "Cependant", "En conclusion"].map((x) => (
                <li
                  key={x}
                  className="bg-white p-3 rounded border-[3px] border-[var(--color-neo-border)] shadow-[2px_2px_0_0_rgba(30,30,30,1)]"
                >
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
