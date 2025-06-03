import type { User as ApiUser } from "@/models/user"
declare module "next-auth" {
  interface User extends ApiUser {
  }

  interface Session {
    user: ApiUser
    apiToken: string
  }
}
declare module "next-auth/jwt" {
  interface JWT extends ApiUser {
  }
}
