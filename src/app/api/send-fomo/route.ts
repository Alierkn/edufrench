import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Kullanıcı bilgisini çek (okul, vb.)
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!currentUser || !currentUser.school) {
     return NextResponse.json({ error: "Kullanıcı veya Okul bilgisi eksik" }, { status: 400 });
  }

  const { moduleId, action } = await req.json();

  // 1. Öğrenci için yeni bir "StudySession" (Ders Çalışma Seansı) Başlat veya Bitir.
  let studySession;
  if (action === "start") {
     studySession = await prisma.studySession.create({
       data: {
         userId: currentUser.id,
         moduleId: moduleId
       }
     });

     // 2. GAMIFICATION (FOMO) - Aynı okuldaki diğer öğrencileri bul
     const classMates = await prisma.user.findMany({
       where: { 
         school: currentUser.school, 
         id: { not: currentUser.id }
       },
       take: 5 // Çok kalabalıksa ilk 5 kişiyi uyaralım (API limitleri için)
     });

     // 3. Resend API ile Onlara "Ahmet çalışıyor" Maili Gönder (Şifre varsa)
     if (process.env.RESEND_API_KEY && classMates.length > 0) {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const emails = classMates.map(c => c.email).filter(Boolean) as string[];

        try {
          // Gerçek Mail Gönderimi
          await resend.emails.send({
            from: 'EduFrancais <noreply@edufrancais.com>',
            to: emails,
            subject: `🔥 O-là-là ! ${currentUser.name} Sınıfı Geçiyor!`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 4px solid black; background-color: #FDF9F1;">
                <h1 style="color: red; font-weight: 900;">DİKKAT!</h1>
                <p style="font-size: 18px;">Arkadaşın <strong>${currentUser.name}</strong> şu an EduFrancais'de aktif şekilde bir modül çalışmaya başladı!</p>
                <p style="font-size: 16px;">${currentUser.school} lisesinde liderlik şansını kaybetmemek için sen de hemen giriş yap.</p>
                <a href="http://localhost:3000/login" style="display:inline-block; padding: 15px 30px; background-color: black; color: white; text-decoration: none; font-weight: bold;">Hemen Derse Katıl</a>
              </div>
            `
          });
          console.log(`[FOMO Mail] => ${emails.length} okul arkadaşına bildirim atıldı.`);
        } catch (err) {
          console.error("Resend Hatası", err);
        }
     } else {
        console.log(`[MOCK FOMO Mail] => '${currentUser.school}' okulundaki ${classMates.length} öğrenciye mail atılacaktı ama RESEND_API_KEY eksik.`);
     }
  }

  return NextResponse.json({ success: true, studySession });
}
