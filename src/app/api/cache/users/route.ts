import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/libs/supabase";
import { redis } from "@/libs/redis";

export async function GET() {
    try {
        const key = "user_cache"
        const cacheUsers = await redis.get(key)
        if (typeof cacheUsers === "string") {
            const parse = JSON.parse(cacheUsers)
            return NextResponse.json(parse)
        }

        const { data, error } = await supabase
            .from("users")
            .select()

        if (error) {
            console.error("Terjadi Kesalahan harap refresh halaman", error)
            return

        } else {
            await redis.set(key, JSON.stringify(data), { ex: 60 })
            console.log("Menyimpan ke Redis:", data);
            return NextResponse.json(data)
        }
    } catch (error) {
        console.error("Terjadi Kesalahan harap refresh halaman", error)
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId, status } = await req.json();

        if (!userId || !["online", "offline"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        // Update status di Supabase
        const { error } = await supabase
            .from("users")
            .update({ status })
            .eq("id", userId);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        // Simpan ke Redis (caching)
        await redis.set(`user:${userId}:status`, status, { ex: 60 });

        return NextResponse.json({ message: `${status}` });
    } catch (error) {
        console.error("Terjadi Kesalahan", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}