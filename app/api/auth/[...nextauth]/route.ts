import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

import { db } from "@/drizzle/src/db";
import { users } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

const handler = NextAuth({

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {

    async signIn({ user }) {

      if (!user.email) {
        return false;
      }

      const existingUser =
        await db.query.users.findFirst({
          where: eq(
            users.email,
            user.email
          )
        });

      if (!existingUser) {

        await db.insert(users).values({
          name: user.name ?? "Unknown User",
          email: user.email,
          image: user.image ?? ""
        });

      }

      return true;
    }

  }

});

export { handler as GET, handler as POST };