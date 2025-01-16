"use client";

import React from "react";
import {
  Box,
  Flex,
  Input,
  Text,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { ColorModeToggle } from "@/components/ui/color-mode";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Spin as Hamburger } from 'hamburger-react'
import Sidebar from "../Sidebar";

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

const users: User[] = [
  { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/150?img=1", status: "online" },
  { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/150?img=2", status: "mengetik..." },
  { id: 3, name: "Sandi", avatar: "https://i.pravatar.cc/150?img=2", status: "mengetik..." },
  { id: 4, name: "Maya", avatar: "https://i.pravatar.cc/150?img=2", status: "offline" },
];

const Chat: React.FC = () => {
  const [messages, setMessages] = React.useState<Message[]>([
    { id: 1, senderId: 1, receiverId: null, text: "Hello, everyone!", timestamp: "10:00 AM" },
    { id: 2, senderId: 2, receiverId: null, text: "Hi Alice!", timestamp: "10:01 AM" },
    { id: 3, senderId: 2, receiverId: -1, text: "Hey, are you free?", timestamp: "10:02 AM" },
    { id: 4, senderId: -1, receiverId: 2, text: "Yes, what's up?", timestamp: "10:03 AM" },
    { id: 5, senderId: -1, receiverId: 1, text: "Hello Alice, how are you?", timestamp: "1:03 PM" },
  ]);

  const [currentUser, setCurrentUser] = React.useState<User | null>(null); // User yang sedang di-chat
  const [newMessage, setNewMessage] = React.useState<string>("");
  const [isSidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

  // Fungsi untuk mengirim pesan
  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMsg: Message = {
        id: messages.length + 1,
        senderId: -1, // -1 untuk "You"
        receiverId: currentUser?.id || null,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, newMsg]); // Menambahkan pesan baru ke daftar
      setNewMessage("");
    }
  };  

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
    <Flex direction="column" w="100vw" h="100vh" p={4}>
      {/* Header */}
      <Flex justify="space-between" align="center" p={4} shadow="lg" rounded="md" mb={4}>
        <Button
          display={{ base: "block", md: "none" }} // Hanya muncul di perangkat kecil
          size="sm">
          <Hamburger size={24} toggled={isSidebarOpen} toggle={setSidebarOpen}/>
          </Button>
          {currentUser ? ( <Text fontSize="xl" display={{ base: "none", md: "block" }} fontWeight="bold">Realtime Chat</Text> ) : ( <Text fontSize="xl" fontWeight="bold">Realtime - All Chat</Text> )}
        {currentUser && (
      <HStack gap={4}>
        <Avatar name={currentUser.name} src={currentUser.avatar} size="sm" />
        <VStack align="start" gap={0}>
          <Text fontSize="sm" fontWeight="bold">
            {currentUser.name}
          </Text>
          <Badge colorPalette={currentUser.status === "online" ? "green" : "yellow"}>
            {currentUser.status}
          </Badge>
        </VStack>
      </HStack>
      )}
      <ColorModeToggle />
      </Flex>

      <Flex flex="1" direction="row">
        {/* Sidebar */}
        <Sidebar users={users} currentUser={currentUser} setCurrentUser={setCurrentUser} isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} onOpen={() => setSidebarOpen(true)}/>

        {/* Chat Area */}
        <Flex flex="1" direction="column" p={4} shadow="lg" rounded="md">
          <VStack align="stretch" flex="1" overflowY="auto">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message) => {
                const sender = message.senderId === -1
                  ? { name: "You", avatar: "" }
                  : users.find((u) => u.id === message.senderId) || { name: "Unknown", avatar: "" };

                return (
                  <Box key={message.id} p={3} rounded="md" shadow="lg">
                    <Text fontSize="sm" fontWeight="bold">
                      {sender.name}{" "}
                      <Text as="span" fontWeight="normal" color="gray.500">
                        ({message.timestamp})
                      </Text>
                    </Text>
                    <Text>{message.text}</Text>
                  </Box>
                );
              })
            ) : (
              <Text>Tidak ada pesan silahkan kirm pesan</Text>
            )}
          </VStack>

          {/* Message Input */}
          <Flex mt={4} shadow="sm">
            <Input
              variant="flushed"
              placeholder={`ketik Pesan ${currentUser ? `ke ${currentUser.name}` : "ke Semua"}`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button
              ml={2}
              px={4}
              py={2}
              variant="solid"
              bg="blue.500"
              color="white"
              rounded="md"
              _hover={{ bg: "blue.600" }}
              onClick={sendMessage}
            >
              Send
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
    </>
  );
};

export default Chat;
