import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "user" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (
          credentials?.username === "user" &&
          credentials?.password === "password"
        ) {
          return { id: "1", name: "Demo User", email: "user@example.com" };
        }
        return null;
      }
    })
  ]
});