"use server";
import { prisma } from '@/lib/prisma';

export async function getRandomModule(type: string) {
  const modules = await prisma.module.findMany({
    where: { type },
    include: { exercises: { include: { options: true } } }
  });
  if (modules.length === 0) return null;
  // Return a random module to simulate dynamic LMS flow
  return modules[Math.floor(Math.random() * modules.length)];
}
