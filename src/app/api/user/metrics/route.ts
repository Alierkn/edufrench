import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * Öğrenci paneli: puan ve etkinlik sayıları veritabanından (localStorage yerine).
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, weakness: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    const [scoreAgg, submissionCount, studySessionCount] = await Promise.all([
      prisma.submission.aggregate({
        where: { userId: user.id },
        _sum: { score: true },
      }),
      prisma.submission.count({ where: { userId: user.id } }),
      prisma.studySession.count({ where: { userId: user.id } }),
    ]);

    const sumScores = scoreAgg._sum.score ?? 0;
    const participation =
      submissionCount * 12 + studySessionCount * 6;
    const totalScore = Math.max(
      0,
      Math.round(Number(sumScores) + participation)
    );

    return NextResponse.json({
      totalScore,
      submissionCount,
      studySessionCount,
      profileWeakness: user.weakness?.trim() || null,
    });
  } catch (e) {
    console.error("metrics GET:", e);
    return NextResponse.json({ error: "Metrikler alınamadı" }, { status: 500 });
  }
}
