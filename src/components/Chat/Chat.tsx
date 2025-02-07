"use client";

import React from "react";
import {
  // Box,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
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

interface ChatProps{
  messages: Message[];
  currentUser: User | null;
  users: User[];
}
const Chat: React.FC<ChatProps> = ({ users, messages, currentUser }) => {

  // Filter pesan berdasarkan pengguna yang sedang di-chat
  const filteredMessages = currentUser ? 
      messages.filter(
        (msg) =>
          (msg.sender_id === currentUser.id && msg.receiver_id !== null ) || // Pesan dari user ke "You"
          (msg.receiver_id === currentUser.id) // Pesan dari "You" ke user
      ) : messages.filter((msg) => msg.receiver_id === null); // All-chat

  return (
    <>
      <VStack align="stretch" flex="1" overflowY="auto" p={4} gap={4}>
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => {
            const sender = message.sender_id === currentUser?.id
              ? { name: "y", avatar: "x" }
              : users.find((u) => u.id === message.sender_id) || { name: "y", avatar: "x" }; 

        return (
          <HStack key={message.id} align="start" gap={3} p={3} rounded="md">
            {/* Avatar di sebelah kiri */}
            <Avatar name={sender.name} src={sender.avatar} size="sm" />

            {/* Konten pesan */}
            <ul className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 dark:bg-neutral-900 dark:border-neutral-700">
              <Text fontSize="sm" fontWeight="bold">
                {sender.name}{" "}
              <Text as="span" fontWeight="normal" color="gray.500">
               ({message.timestamp instanceof Date ? message.timestamp.toLocaleTimeString("jkt-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                }) : "Waktu tidak ada"})
                </Text>
              </Text>
                <Text>{message.text}</Text>
              </ul>
              </HStack>
              );
              })
            ) : (
          <Text>Tidak ada pesan silahkan kirm pesan</Text>
        )}
      </VStack>
    </>
  );
};

export default Chat;
