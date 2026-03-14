import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import prisma from "./lib/prisma";
import Google from "next-auth/providers/google";
import { randomUUID } from "node:crypto";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    // メールアドレスにアクセス制限（Google のみ）
    signIn: async ({ user, account }) => {
      if (account?.provider !== "google") {
        return true;
      }
      const email = user.email;
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(",").map((e) => e.trim()) ?? [];
      if (!email || allowedEmails.length === 0 || !allowedEmails.includes(email)) {
        return false;
      }
      return true;
    },
    jwt: async ({ user, token }) => {
      if (user?.id) {
        let userId = user.id;

        // 旧実装で作られた temp-user-* を通常IDへ一度だけ移行する
        if (userId.startsWith("temp-user")) {
          const migratedId = randomUUID();
          try {
            await prisma.user.update({
              where: { id: userId },
              data: {
                id: migratedId,
                email: user.email ?? undefined,
                name: user.name ?? undefined,
                image: user.image ?? undefined,
              },
            });
            userId = migratedId;
          } catch (error) {
            console.error("Failed to migrate temporary user id:", error);
          }
        }

        token.sub = userId;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    error: "/error",
  },
});
