export function validatePasswordStrength(
  password: string
): { ok: true } | { ok: false; message: string } {
  if (password.length < 10) {
    return { ok: false, message: "Şifre en az 10 karakter olmalıdır." };
  }
  if (password.length > 256) {
    return { ok: false, message: "Şifre çok uzun." };
  }
  if (!/[a-z]/.test(password)) {
    return { ok: false, message: "Şifre en az bir küçük harf (a–z) içermelidir." };
  }
  if (!/[A-Z]/.test(password)) {
    return { ok: false, message: "Şifre en az bir büyük harf (A–Z) içermelidir." };
  }
  if (!/[0-9]/.test(password)) {
    return { ok: false, message: "Şifre en az bir rakam içermelidir." };
  }
  return { ok: true };
}
