import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

type CunstomUser = {
    role: string,
    id: string,
    age: Date,
    timezone: number,
    problems: string[]
}

declare module "next-auth" {
    interface Session {
        user: CunstomUser & DefaultSession
    }

    interface User extends DefaultUser, CunstomUser {}
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT, CunstomUser {}
}