import React from 'react';
import { Input } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { LuSendHorizontal } from "react-icons/lu";
import { supabase } from '@/libs/supabase';

interface User {
  id: number;
  name: string;
  avatar: string;
  status: string;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number | null; // Null untuk all-chat
  text: string;
  timestamp: string;
}

interface SendMessageProps {
  messages: Message[];
  newMessage: string;
  currentUser: User | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
}

const SendMessage: React.FC<SendMessageProps> = ({ newMessage, currentUser, setMessages, setNewMessage }) => {

  // Fungsi untuk mengirim pesan
  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            text: newMessage,  // Kolom yang benar adalah 'text'
            sender_id: currentUser?.id || null, // Ambil dari currentUser
            receiver_id: null, // Null untuk chat ke semua orang
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const newMsg: Message = {
        id: data.id,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        text: data.text,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }),
      };

      setMessages((prev) => [...prev, newMsg]); // Tambahkan pesan baru ke daftar
      setNewMessage(""); // Kosongkan input setelah mengirim
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    }
  };

  return (
    <>
      <Input
        p={4}
        variant="outline"
        css={{ "--focus-color": "lime" }}
        placeholder={`Ketik pesan ${currentUser ? `ke ${currentUser.name}` : "ke Semua"}`}
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <Button
        ml={2}
        px={3}
        variant="solid"
        bg="blue.500"
        color="white"
        rounded="md"
        _hover={{ bg: "blue.600" }}
        onClick={sendMessage}
      >
        <LuSendHorizontal /> Send
      </Button>
    </>
  );
};

export default SendMessage;
