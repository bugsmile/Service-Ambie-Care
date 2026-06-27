import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: "GUARDIAN" | "FACILITY_ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    role: "GUARDIAN" | "FACILITY_ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "GUARDIAN" | "FACILITY_ADMIN";
  }
}
