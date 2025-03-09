import { supabase } from "@/libs/supabase";
import { redis } from "@/libs/redis";

export async function GET() {
    try {
        const cacheUsers = (await redis.get("user_cache")) 
        if (cacheUsers) {
            return Response.json(cacheUsers)
        }

        const { data, error } = await supabase
            .from("users")
            .select()

        if (error) {
            console.error("Terjadi Kesalahan harap refresh halaman", error)
            return

        } else {
            await redis.set("user_cache", JSON.stringify(data), { ex: 120 })
            return Response.json(data)
        }
    } catch (error) {
        console.error("Terjadi Kesalahan harap refresh halaman", error)
    }
}