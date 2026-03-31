import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      school?: string | null;
      grade?: string | null;
      weakness?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    school?: string | null;
    grade?: string | null;
    weakness?: string | null;
    profileFetchedAt?: number;
  }
}
