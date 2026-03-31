import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CUID_LIKE = /^c[a-z0-9]{20,}$/i;

function isValidId(s: string): boolean {
  return UUID_LIKE.test(s) || CUID_LIKE.test(s);
}

/**
 * PO oturumunu veritabanına kaydeder (ses dosyası ileride blob/ElevenLabs ile mediaUrl).
 * Şimdilik meta + isteğe bağlı geçerli exerciseId.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Geçersiz gövde" }, { status: 400 });
    }

    const moduleId = typeof body.moduleId === "string" ? body.moduleId.slice(0, 200) : "";
    const moduleSource = body.moduleSource === "cms" || body.moduleSource === "prisma" ? body.moduleSource : "unknown";
    const durationSeconds = Number(body.durationSeconds);
    const exerciseIdRaw = typeof body.exerciseId === "string" ? body.exerciseId : "";
    const audioMimeType = typeof body.audioMimeType === "string" ? body.audioMimeType.slice(0, 80) : undefined;
    const audioByteLength = Number.isFinite(Number(body.audioByteLength)) ? Number(body.audioByteLength) : undefined;

    if (!moduleId.trim()) {
      return NextResponse.json({ error: "moduleId gerekli" }, { status: 400 });
    }
    if (!Number.isFinite(durationSeconds) || durationSeconds < 0 || durationSeconds > 600) {
      return NextResponse.json({ error: "durationSeconds 0–600 arası olmalı" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    let exerciseId: string | null = null;
    if (exerciseIdRaw && isValidId(exerciseIdRaw)) {
      const ex = await prisma.exercise.findUnique({ where: { id: exerciseIdRaw } });
      if (ex) exerciseId = ex.id;
    }

    const meta = {
      kind: "PO_SESSION" as const,
      moduleId: moduleId.trim(),
      moduleSource,
      durationSeconds: Math.round(durationSeconds),
      audioMimeType,
      audioByteLength,
      submittedAt: new Date().toISOString(),
      note: "Ses dosyası henüz sunucuya yüklenmedi; ElevenLabs / blob entegrasyonu için mediaUrl alanı kullanılacak.",
    };

    const submission = await prisma.submission.create({
      data: {
        userId: user.id,
        exerciseId,
        content: JSON.stringify(meta),
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: "Enregistrement enregistré. L’enseignant pourra voir la durée et le sujet.",
    });
  } catch (e) {
    console.error("PO submission:", e);
    return NextResponse.json({ error: "Kayıt başarısız" }, { status: 500 });
  }
}
