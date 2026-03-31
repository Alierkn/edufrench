import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { escapeHtml } from "@/lib/htmlEscape";
import { getAppBaseUrl } from "@/lib/appBaseUrl";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      school: true,
      emailFomoOptIn: true,
    },
  });

  if (!currentUser || !currentUser.school) {
     return NextResponse.json({ error: "Kullanıcı veya Okul bilgisi eksik" }, { status: 400 });
  }

  if (!currentUser.emailFomoOptIn) {
    return NextResponse.json({
      success: true,
      skipped: true,
      message: "FOMO e-postaları için profilde onay gerekir.",
    });
  }

  const raw = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const moduleId = typeof raw.moduleId === "string" ? raw.moduleId : "";
  const action = typeof raw.action === "string" ? raw.action : "";

  let studySession: Awaited<ReturnType<typeof prisma.studySession.create>> | null = null;
  if (action === "start" && moduleId.length > 0) {
    const prismaModule = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!prismaModule) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: "Modül yalnızca CMS’de; StudySession atlandı.",
      });
    }

    studySession = await prisma.studySession.create({
      data: {
        userId: currentUser.id,
        moduleId,
      },
    });

    // 2. GAMIFICATION (FOMO) - Aynı okuldaki diğer öğrencileri bul
    const classMates = await prisma.user.findMany({
       where: { 
         school: currentUser.school, 
         id: { not: currentUser.id },
         emailFomoOptIn: true,
       },
       take: 5
     });

     // 3. Resend API ile Onlara "Ahmet çalışıyor" Maili Gönder (Şifre varsa)
     if (process.env.RESEND_API_KEY && classMates.length > 0) {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const emails = classMates.map(c => c.email).filter(Boolean) as string[];

        const safeName = escapeHtml(currentUser.name ?? "Bir öğrenci");
        const safeSchool = escapeHtml(currentUser.school ?? "");
        const loginUrl = `${getAppBaseUrl()}/login`;
        const subjectPlain = (currentUser.name || "Öğrenci").replace(/[\r\n<>"']/g, "").slice(0, 50);

        try {
          await resend.emails.send({
            from: "EduFrancais <noreply@edufrancais.com>",
            to: emails,
            subject: `🔥 ${subjectPlain} çalışıyor`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 4px solid black; background-color: #FDF9F1;">
                <h1 style="color: red; font-weight: 900;">DİKKAT!</h1>
                <p style="font-size: 18px;">Arkadaşın <strong>${safeName}</strong> şu an EduFrancais'te bir modüle başladı.</p>
                <p style="font-size: 16px;">${safeSchool} — liderlik için sen de giriş yap.</p>
                <a href="${loginUrl}" style="display:inline-block; padding: 15px 30px; background-color: black; color: white; text-decoration: none; font-weight: bold;">Derse katıl</a>
              </div>
            `,
          });
          console.log(`[FOMO Mail] => ${emails.length} okul arkadaşına bildirim atıldı.`);
        } catch (err) {
          console.error("Resend Hatası", err);
        }
    } else {
      console.log(
        `[MOCK FOMO Mail] => '${currentUser.school}' okulundaki ${classMates.length} öğrenciye mail atılacaktı ama RESEND_API_KEY eksik.`
      );
    }
  }

  return NextResponse.json({ success: true, studySession });
}
