import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getNextAuthSecret } from "@/lib/authSecret";

const PROFILE_REFRESH_MS = 30_000;

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "EduFrancais",
      credentials: {
        email: { label: "E-Posta", type: "email" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({ 
          where: { email: credentials.email } 
        });

        if (!user || !user.password) {
          // Kullanıcı bulunamadı — giriş reddedildi
          return null;
        }

        // Şifre doğrulama (bcrypt hash karşılaştırma)
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return user;
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
          select: { school: true, grade: true, weakness: true, name: true, email: true },
        });
        if (dbUser) {
          token.school = dbUser.school;
          token.grade = dbUser.grade;
          token.weakness = dbUser.weakness;
          token.name = dbUser.name;
          token.email = dbUser.email;
        }
        token.profileFetchedAt = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
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
