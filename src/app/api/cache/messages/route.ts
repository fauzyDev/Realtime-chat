import { supabase } from "@/libs/supabase";
import { redis } from "@/libs/redis";

export async function GET() {
    try {
        const cacheMessages = (await redis.get("messages_cache"))
        if (cacheMessages) {
            return Response.json(cacheMessages)
        }

        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Terjadi Kesalahan harap refresh halaman", error)
            return

        } else {
            await redis.set("messages_cache", JSON.stringify(data.map(msg => ({ ...msg, timestamp: new Date(msg.created_at) }))), { ex: 120 })
            return Response.json(data)
        }
    } catch (error) {
        console.error("Terjadi Kesalahan harap refresh halaman", error)
    }
}