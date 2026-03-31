import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "EduFrancais Girişi",
      credentials: {
        email: { label: "Lise E-Postanız", type: "email", placeholder: "ad.soyad@ogr.sjb.k12.tr" },
        password: { label: "Şifreniz", type: "password" }
      },
      async authorize(credentials) {
         if (!credentials?.email) return null;
         
         // Eğitim MVP Sistemi: E-posta varsa giriş yap, yoksa yeni kayıt oluştur.
         // Gerçek sistemde şifre hash kontrolü (bcrypt) yapılmalıdır.
         let user = await prisma.user.findUnique({ where: { email: credentials.email } });
         
         if (!user) {
            user = await prisma.user.create({ 
               data: { 
                 email: credentials.email, 
                 name: credentials.email.split('@')[0].toUpperCase(),
                 school: credentials.email.includes('sjb') ? 'Saint Benoît' : 'Diğer',
                 grade: '10' // Default
               } 
            });
         }
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
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
