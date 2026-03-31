/**
 * Production'da NEXTAUTH_SECRET zorunlu; geliştirmede sabit yerel değer (asla prod'a taşınmamalı).
 */
export function getNextAuthSecret(): string {
  const fromEnv = process.env.NEXTAUTH_SECRET?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    console.error(
      "[next-auth] NEXTAUTH_SECRET tanımlı değil — oturum güvenliği risk altında. Vercel/host ortam değişkenini ayarlayın."
    );
    return "";
  }
  return "local-only-nextauth-secret-32chars-min!!";
}
