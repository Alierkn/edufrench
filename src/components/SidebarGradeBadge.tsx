"use client";

import { useSession } from "next-auth/react";

export function SidebarGradeBadge() {
  const { data: session, status } = useSession();
  const grade = (session?.user as { grade?: string } | undefined)?.grade;

  if (status === "loading") {
    return (
      <div className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-gray-100 neo-box inline-block animate-pulse">
        …
      </div>
    );
  }

  if (grade) {
    return (
      <div className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[var(--color-neo-yellow)] neo-box inline-block">
        {grade}. Sınıf
      </div>
    );
  }

  return (
    <div className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-amber-100 neo-box inline-block">
      Profil eksik
    </div>
  );
}
