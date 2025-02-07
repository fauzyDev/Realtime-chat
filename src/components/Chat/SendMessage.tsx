import React from 'react';
import { Textarea } from '@chakra-ui/react';
import { Button } from "../ui/button";
import { LuSendHorizontal } from "react-icons/lu";

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
  timestamp: Date;
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
    if (!newMessage || newMessage.trim() === "") return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newMessage,
          receiver_id: currentUser?.id ?? null, // Null untuk all-chat
        }),
      });
  
      if (!response.ok) {
        throw new Error("Gagal mengirim pesan");
      }
  
      const data = await response.json();

      const newMsg: Message = {
        id: data.id,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        text: data.text,
        timestamp: new Date(data.created_at),
      };

      setMessages((prev) => [...prev, newMsg]); // Tambahkan pesan baru ke daftar
      setNewMessage(""); // Kosongkan input setelah mengirim
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    }
  };

  return (
    <>
      <Textarea
        p={4}
        size="sm"
        variant="subtle"
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
        onClick={sendMessage}>
        <LuSendHorizontal /> Send
      </Button>
    </>
  );
};

export default SendMessage;
