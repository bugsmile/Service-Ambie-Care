import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Prototype logic: 
        // guardian@test.com -> GUARDIAN role
        // admin@test.com -> FACILITY_ADMIN role
        if (credentials?.email === "guardian@test.com" && credentials?.password === "password") {
          return { id: "1", name: "보호자 사용자", email: "guardian@test.com", role: "GUARDIAN" };
        }
        if (credentials?.email === "admin@test.com" && credentials?.password === "password") {
          return { id: "2", name: "관리자 사용자", email: "admin@test.com", role: "FACILITY_ADMIN" };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
