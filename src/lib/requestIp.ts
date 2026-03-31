import type { RequestInternal } from "next-auth";

/** next-auth Credentials `authorize` içindeki `req.headers` için. */
export function clientIpFromAuthReq(
  req: Pick<RequestInternal, "headers"> | undefined
): string {
  if (!req?.headers) return "unknown";
  const h = req.headers;
  const pick = (name: string): string | undefined => {
    if (typeof (h as Headers).get === "function") {
      return (h as Headers).get(name) ?? undefined;
    }
    const rec = h as Record<string, string | string[] | undefined>;
    const v = rec[name.toLowerCase()] ?? rec[name];
    if (Array.isArray(v)) return v[0];
    return typeof v === "string" ? v : undefined;
  };
  const xff = pick("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const xr = pick("x-real-ip");
  if (xr) return xr.trim().slice(0, 64);
  return "unknown";
}

/** App Router `Request` */
export function getRequestIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  return "unknown";
}
