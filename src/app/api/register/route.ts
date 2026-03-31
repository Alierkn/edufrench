import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { rateLimit } from "@/lib/rateLimit";
import { getRequestIp } from "@/lib/requestIp";
import { validatePasswordStrength } from "@/lib/passwordPolicy";

const REGISTER_WINDOW_MS = 60 * 60 * 1000;
const REGISTER_MAX_PER_IP = 8;

export async function POST(req: Request) {
  try {
    const ip = getRequestIp(req);
    const rl = rateLimit(`register:${ip}`, REGISTER_MAX_PER_IP, REGISTER_WINDOW_MS);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Çok fazla kayıt denemesi. Lütfen daha sonra tekrar deneyin." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const raw = await req.json();
    const name = typeof raw.name === "string" ? raw.name.trim().slice(0, 120) : "";
    const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase().slice(0, 254) : "";
    const password = typeof raw.password === "string" ? raw.password : "";

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Ad, e-posta ve şifre alanları zorunludur." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Geçerli bir e-posta girin." }, { status: 400 });
    }

    const pw = validatePasswordStrength(password);
    if (!pw.ok) {
      return NextResponse.json({ error: pw.message }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Kayıt tamamlanamadı. Bilgilerinizi kontrol edip tekrar deneyin." },
        { status: 400 }
      );
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 12);

    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Hesabınız başarıyla oluşturuldu!",
    });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
