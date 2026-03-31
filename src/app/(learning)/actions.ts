"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sanityClient } from "@/lib/sanity.client";
import { modulesWithExercisesQuery } from "@/lib/sanity.queries";
import { matchesUserProfile } from "@/lib/filterCmsContent";
import type { CmsModule } from "@/types/cms";
import type { UnifiedLearningModule } from "@/types/learning";
import {
  isModuleUsableForType,
  mapCmsModule,
  mapPrismaModule,
  randomElement,
} from "@/lib/mapLearningModule";

export async function getRandomModule(type: string) {
  const modules = await prisma.module.findMany({
    where: { type },
    include: { exercises: { include: { options: true } } },
  });
  if (modules.length === 0) return null;
  return modules[Math.floor(Math.random() * modules.length)];
}

/**
 * Önce Sanity (profil filtresi), yoksa Prisma’dan rastgele modül.
 */
export async function loadLearningModule(moduleType: string): Promise<UnifiedLearningModule | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user as { grade?: string; school?: string } | undefined;

  try {
    const raw = await sanityClient.fetch(modulesWithExercisesQuery);
    const list: CmsModule[] = Array.isArray(raw) ? raw : [];
    const cmsCandidates = list
      .filter(
        (m) =>
          m.moduleType === moduleType &&
          matchesUserProfile(m.targetGrades, m.targetSchools, user?.grade, user?.school)
      )
      .map(mapCmsModule)
      .filter((u) => isModuleUsableForType(u, moduleType));

    const cmsPick = randomElement(cmsCandidates);
    if (cmsPick) return cmsPick;
  } catch (e) {
    console.error("loadLearningModule CMS:", e);
  }

  const prismaMods = await prisma.module.findMany({
    where: { type: moduleType, isActive: true },
    include: { exercises: { include: { options: true } } },
  });
  if (!prismaMods.length) return null;
  const mapped = prismaMods.map(mapPrismaModule).filter((u) => isModuleUsableForType(u, moduleType));
  const pool = mapped.length ? mapped : prismaMods.map(mapPrismaModule);
  return randomElement(pool);
}
