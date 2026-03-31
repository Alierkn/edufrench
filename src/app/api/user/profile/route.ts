import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        school: true,
        grade: true,
        weakness: true,
        source: true,
        emailFomoOptIn: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json({ error: "Profil okunamadı." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await req.json();
    const clamp = (v: unknown, max: number) =>
      typeof v === "string" ? v.trim().slice(0, max) : "";

    const school = clamp(body.school, 80);
    const grade = clamp(body.grade, 20);
    const weakness = clamp(body.weakness, 120);
    const source = clamp(body.source, 80);
    const emailFomoOptIn =
      typeof body.emailFomoOptIn === "boolean" ? body.emailFomoOptIn : undefined;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(school && { school }),
        ...(grade && { grade }),
        ...(weakness && { weakness }),
        ...(source && { source }),
        ...(emailFomoOptIn !== undefined && { emailFomoOptIn }),
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: { 
        school: updatedUser.school, 
        grade: updatedUser.grade,
        weakness: updatedUser.weakness,
        emailFomoOptIn: updatedUser.emailFomoOptIn,
      } 
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "Profil güncellenemedi." }, { status: 500 });
  }
}
