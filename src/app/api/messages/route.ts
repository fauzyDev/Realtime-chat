import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/libs/supabase';
import { userSession } from '@/libs/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await userSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { text, receiver_id } = await req.json();
    if (!text.trim()) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    // Simpan pesan ke database
    const { data, error } = await supabase
      .from("messages")
      .insert([{ text, sender_id: session.user, receiver_id }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}