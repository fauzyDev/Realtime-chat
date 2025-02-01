import NextAuth from "next-auth"
import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"

const clientId: string = process.env.SECRET_GOOGLE_CLIENT_ID ?? "";
const clientSecret: string = process.env.SECRET_GOOGLE_SECRET_ID ?? "";
const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const secret: string = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const authOptions: NextAuthOptions = {
    providers: [
        Google({
            clientId,
            clientSecret 
        })
    ],
    adapter: SupabaseAdapter({
        url,
        secret
    }),
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "database" }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }