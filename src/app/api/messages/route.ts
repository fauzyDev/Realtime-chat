import { supabase } from '@/libs/supabase';
import { userSession } from '@/libs/auth';

export async function POST(req: Request) {
    try {
        const session = await userSession()
        if (!session) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
          }
        const { text, receiver_id } = await req.json();
        if (!text.trim()) {
            return Response.json({ error: "Message cannot be empty" }, { status: 400 });
          }

          // Simpan pesan ke database
    const { data, error } = await supabase
    .from("messages")
    .insert([{ text, sender_id: session.id, receiver_id }])
    .select()
    .single();

  if (error) throw error;

  return Response.json(data);
    } catch (error) {
        return Response.json({ error: "Failed to send message" }, { status: 500 });
    }
 }