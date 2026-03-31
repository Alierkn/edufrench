import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "USER" | "ADMIN";
  }

  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      role?: "USER" | "ADMIN";
      school?: string | null;
      grade?: string | null;
      weakness?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "USER" | "ADMIN";
    school?: string | null;
    grade?: string | null;
    weakness?: string | null;
    profileFetchedAt?: number;
  }
}
