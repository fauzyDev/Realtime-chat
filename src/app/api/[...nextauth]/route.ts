import NextAuth from "next-auth"
import Github from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth"

const clientId: string = process.env.GOOGLE_ID ?? "";
const clientSecret: string = process.env.GOOGLE_SECRET ?? "";

export const authOptions: NextAuthOptions = {
    providers: [
        Github({
            clientId,
            clientSecret 
        })
    ],
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }