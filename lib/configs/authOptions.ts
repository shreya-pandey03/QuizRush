import { db } from "@/drizzle/src/db";
import { users } from "@/drizzle/src/db/schema";
import type { User } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
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

  callbacks: {
    async signIn({ user }: { user: User }) {
      const existingUser =
        await db.query.users.findFirst({
          where: (users, { eq }) =>
            eq(users.email, user.email!),
        });

      if (!existingUser) {
        await db.insert(users).values({
          name: user.name ?? "",
          email: user.email ?? "",
          image: user.image ?? null,
        });
      }

      return true;
    },
  },
};