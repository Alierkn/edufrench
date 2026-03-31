import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sanityClient } from "@/lib/sanity.client";
import { modulesWithExercisesQuery } from "@/lib/sanity.queries";
import { matchesUserProfile } from "@/lib/filterCmsContent";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { grade?: string; school?: string } | undefined;
    const { searchParams } = new URL(req.url);
    const moduleType = searchParams.get("moduleType")?.trim() || null;

    const raw = await sanityClient.fetch(modulesWithExercisesQuery);
    let list = Array.isArray(raw) ? raw : [];

    if (moduleType) {
      list = list.filter(
        (m: { moduleType?: string }) => m.moduleType === moduleType
      );
    }

    const filtered = list.filter((m: { targetGrades?: string[]; targetSchools?: string[] }) =>
      matchesUserProfile(m.targetGrades, m.targetSchools, user?.grade, user?.school)
    );

    return NextResponse.json({ modules: filtered });
  } catch (e) {
    console.error("cms-modules:", e);
    return NextResponse.json({ modules: [], error: "CMS okunamadı" }, { status: 200 });
  }
}
