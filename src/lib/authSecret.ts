/**
 * Production çalışma zamanında NEXTAUTH_SECRET zorunlu.
 * `next build` sırasında NODE_ENV=production olur; Next `NEXT_PHASE=phase-production-build` yazar — bu aşamada secret olmadan derleme kırılmasın (Vercel’de env bazen yalnızca runtime’a eklenir).
 */
const LOCAL_DEV_FALLBACK = "local-only-nextauth-secret-32chars-min!!";
/** Yalnızca derleme anı; asla gerçek isteklerde kullanılmamalı (runtime’da NEXT_PHASE bu değerde olmaz). */
const BUILD_TIME_PLACEHOLDER = "build-only-nextauth-secret-do-not-use-32!";

export function getNextAuthSecret(): string {
  const fromEnv = process.env.NEXTAUTH_SECRET?.trim();
  if (fromEnv) return fromEnv;

  if (process.env.NODE_ENV !== "production") {
    return LOCAL_DEV_FALLBACK;
  }

  if (process.env.NEXT_PHASE === "phase-production-build") {
    return BUILD_TIME_PLACEHOLDER;
  }

  throw new Error(
    "NEXTAUTH_SECRET tanımlı değil. Üretimde oturum imzası için güçlü bir gizli anahtar ayarlayın (ör. openssl rand -base64 32). Vercel: Project → Settings → Environment Variables."
  );
}
