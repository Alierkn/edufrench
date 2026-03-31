import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sanityClient } from "@/lib/sanity.client";
import { vocabTopicsQuery } from "@/lib/sanity.queries";
import { matchesUserProfile } from "@/lib/filterCmsContent";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { grade?: string; school?: string } | undefined;

    const raw = await sanityClient.fetch(vocabTopicsQuery);
    const list = Array.isArray(raw) ? raw : [];

    const filtered = list.filter(
      (t: { targetGrades?: string[]; targetSchools?: string[] }) =>
        matchesUserProfile(t.targetGrades, t.targetSchools, user?.grade, user?.school)
    );

    return NextResponse.json({ topics: filtered });
  } catch (e) {
    console.error("vocab-topics:", e);
    return NextResponse.json({ topics: [], error: "CMS okunamadı" }, { status: 200 });
  }
}
