"use client";

import React from "react";
import {
  Box,
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
  senderId: number;
  receiverId: number | null; // Null untuk all-chat
  text: string;
  timestamp: string;
}

interface ChatProps{
  messages: Message[];
  currentUser: User | null;
  users: User[];
}
const Chat: React.FC<ChatProps> = ({ users, messages, currentUser }) => {

  // Filter pesan berdasarkan pengguna yang sedang di-chat
  const filteredMessages = currentUser
    ? messages.filter(
        (msg) =>
          (msg.senderId === currentUser.id && msg.receiverId === -1) || // Pesan dari user ke "You"
          (msg.senderId === -1 && msg.receiverId === currentUser.id) // Pesan dari "You" ke user
      )
    : messages.filter((msg) => msg.receiverId === null); // All-chat

  return (
    <>
      <VStack align="stretch" flex="1" overflowY="auto" p={4} gap={4}>
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => {
            const sender = message.senderId === -1
              ? { name: "You", avatar: "null" }
              : users.find((u) => u.id === message.senderId) || { name: "Unknown", avatar: "" };

        return (
          <HStack key={message.id} align="start" gap={3} p={3} rounded="md" shadow="lg">
            {/* Avatar di sebelah kiri */}
            <Avatar name={sender.name} src={sender.avatar} size="sm" />

            {/* Konten pesan */}
            <Box>
              <Text fontSize="sm" fontWeight="bold">
                {sender.name}{" "}
              <Text as="span" fontWeight="normal" color="gray.500">
                ({message.timestamp})
                </Text>
              </Text>
                <Text>{message.text}</Text>
              </Box>
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
