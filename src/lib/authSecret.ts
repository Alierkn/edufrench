/**
 * Production'da NEXTAUTH_SECRET zorunlu; geliştirmede sabit yerel değer (asla prod'a taşınmamalı).
 */
export function getNextAuthSecret(): string {
  const fromEnv = process.env.NEXTAUTH_SECRET?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXTAUTH_SECRET tanımlı değil. Üretimde oturum imzası için güçlü bir gizli anahtar ayarlayın (ör. openssl rand -base64 32)."
    );
  }
  return "local-only-nextauth-secret-32chars-min!!";
}
