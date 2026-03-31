import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || "neo-brutalist-edu-francais-super-secret",
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      const userId = (token.id as string) || (token.sub as string);
      if (userId) {
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).school = token.school;
        (session.user as any).grade = token.grade;
        (session.user as any).weakness = token.weakness;
        if (token.name) session.user.name = token.name as string;
        if (token.email) session.user.email = token.email as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
