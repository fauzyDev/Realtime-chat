import NextAuth from "next-auth"
import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth"

const clientId: string = process.env.GOOGLE_ID ?? "";
const clientSecret: string = process.env.GOOGLE_SECRET ?? "";

export const authOptions: NextAuthOptions = {
    providers: [
        Google({
            clientId,
            clientSecret 
        })
    ],
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }