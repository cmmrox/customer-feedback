import "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
    role: string;
  }

  interface Session {
    user: User & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
} 