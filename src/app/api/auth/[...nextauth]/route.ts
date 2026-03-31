import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getNextAuthSecret } from "@/lib/authSecret";
import { rateLimit } from "@/lib/rateLimit";
import { clientIpFromAuthReq } from "@/lib/requestIp";

const PROFILE_REFRESH_MS = 30_000;
/** Giriş denemesi: IP + e-posta başına 12 deneme / 15 dk */
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 12;
/** Var olmayan kullanıcıda bcrypt süresini yaklaştırmak için sabit hash */
const BCRYPT_TIMING_DUMMY =
  "$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31cu";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "EduFrancais",
      credentials: {
        email: { label: "E-Posta", type: "email" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailNorm = credentials.email.trim().toLowerCase();
        const ip = clientIpFromAuthReq(req);
        const rl = rateLimit(`login:${ip}:${emailNorm}`, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
        if (!rl.ok) return null;

        const user = await prisma.user.findUnique({
          where: { email: emailNorm },
        });

        if (!user || !user.password) {
          await bcrypt.compare(credentials.password, BCRYPT_TIMING_DUMMY);
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: getNextAuthSecret(),
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
        token.profileFetchedAt = 0;
      }
      const userId = (token.id as string) || (token.sub as string);
      const last =
        typeof token.profileFetchedAt === "number" ? token.profileFetchedAt : 0;
      const shouldRefreshProfile =
        Boolean(user) || Date.now() - last > PROFILE_REFRESH_MS;

      if (userId && shouldRefreshProfile) {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            school: true,
            grade: true,
            weakness: true,
            name: true,
            email: true,
            role: true,
          },
        });
        if (dbUser) {
          token.school = dbUser.school;
          token.grade = dbUser.grade;
          token.weakness = dbUser.weakness;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.role = dbUser.role;
        }
        token.profileFetchedAt = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role ?? "USER";
        session.user.school = token.school;
        session.user.grade = token.grade;
        session.user.weakness = token.weakness;
        if (token.name) session.user.name = token.name as string;
        if (token.email) session.user.email = token.email as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
