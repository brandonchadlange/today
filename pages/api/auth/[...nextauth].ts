import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prismaClient from "../../../utils/prisma-client";

const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

const googleProvider = GoogleProvider({
  clientId,
  clientSecret,
});

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 3000,
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (!session?.user) {
        return session;
      }

      return { ...session, uid: token.sub };
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }

      return token;
    },
  },
  adapter: PrismaAdapter(prismaClient),
  providers: [googleProvider],
};

export default NextAuth(authOptions);
