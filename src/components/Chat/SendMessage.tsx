import React from 'react';
import { Input } from "@chakra-ui/react";
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
    senderId: number;
    receiverId: number | null; // Null untuk all-chat
    text: string;
    timestamp: string;
  }

interface SendMessageProps {
    messages: Message[];
    newMessage: string
    currentUser: User | null;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
    setNewMessage: React.Dispatch<React.SetStateAction<string>>
}
const SendMessage: React.FC<SendMessageProps> = ({ messages, newMessage, currentUser, setMessages, setNewMessage }) => {

    // Fungsi untuk mengirim pesan
    const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMsg: Message = {
        id: messages.length + 1,
        senderId: -1, // -1 untuk "You"
        receiverId: currentUser?.id || null,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }),
      };

      setMessages((prev) => [...prev, newMsg]); // Menambahkan pesan baru ke daftar
      setNewMessage("");
    }
  };

    return (
      <>
        <Input
          p={4}
          variant="outline" 
          css={{ "--focus-color": "lime" }}
          placeholder={`ketik Pesan ${currentUser ? `ke ${currentUser.name}` : "ke Semua"}`}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}/>
            
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
}

export default SendMessage;
