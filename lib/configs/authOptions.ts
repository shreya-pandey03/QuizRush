import { db } from "@/drizzle/src/db";
import { users } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

import type { NextAuthOptions, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: "admin" | "user";
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email),
      });

      if (!existingUser) {
        await db.insert(users).values({
          name: user.name ?? "Unknown User",
          email: user.email,
          image: user.image ?? null,
        });
      } else {
        await db
          .update(users)
          .set({
            name: user.name ?? existingUser.name,
            image: user.image ?? existingUser.image,
          })
          .where(eq(users.email, user.email));
      }
      return true;
    },

    async session({ session }) {
      if (!session.user?.email) return session;

      const dbUser = await db.query.users.findFirst({
        where: eq(users.email, session.user.email),
      });

      if (dbUser) {
        session.user = {
          ...session.user,
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          image: dbUser.image ?? null,
        };
      }

      return session;
    },
  },
};
