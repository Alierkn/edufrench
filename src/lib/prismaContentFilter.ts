import type { Module } from "@prisma/client";
import { matchesUserProfile } from "@/lib/filterCmsContent";

function asStringArray(v: unknown): string[] | undefined {
  if (v == null) return undefined;
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  return undefined;
}

/** Prisma Module Json alanları ile kullanıcı profili eşleşmesi */
export function prismaModuleMatchesUser(
  m: Module,
  userGrade: string | null | undefined,
  userSchool: string | null | undefined
): boolean {
  return matchesUserProfile(
    asStringArray(m.targetGrades),
    asStringArray(m.targetSchools),
    userGrade,
    userSchool
  );
}
