import NextAuth from "next-auth"
import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth"
import { supabase } from "@/libs/supabase";

const clientId: string = process.env.SECRET_GOOGLE_CLIENT_ID ?? "";
const clientSecret: string = process.env.SECRET_GOOGLE_SECRET_ID ?? "";

export const authOptions: NextAuthOptions = {
    providers: [
        Google({
            clientId,
            clientSecret 
        })
    ],    
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async signIn({ user }) {
            const { email, name, image } = user
            const { data: users } = await supabase
            .from("user")
            .select()
            .eq("email", email)
            .single()

            if (!users) {
                const { error: inError } = await supabase.from("users").insert([
                { email, name, avatar: image }
                ]);

                if (inError) {
                    console.error("Gagal menyimpan user ke Supabase:", inError);
                    return false;
                }
            }
            return true;
        },

        async session({ session }) {
            if (session?.user) {
                const { data: user } = await supabase
                .from("users")
                .select("id")
                .eq("email", session.user.email)
                .single()

            if (user) {
                session.user = user.id
            }
            }

            return session
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }