import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
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

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    // E-posta zaten kayıtlı mı?
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin." },
        { status: 409 }
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
