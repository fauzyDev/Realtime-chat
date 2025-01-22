"use client";

import React from "react";
import {
  Box,
  Flex,
  Input,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { LuSendHorizontal } from "react-icons/lu";
import Header from "../Header/Header";
import Sidebars from "../Sidebar/Sidebars";
import SelectUser from "../Modal/SelectUser";

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
  { id: 3, name: "Sandi", avatar: "https://i.pravatar.cc/150?img=2", status: "online" },
  { id: 4, name: "Luna", avatar: "https://i.pravatar.cc/150?img=1", status: "offline" },
  { id: 5, name: "Milda", avatar: "https://i.pravatar.cc/150?img=1", status: "offline" },
  { id: 6, name: "Sarah", avatar: "https://i.pravatar.cc/150?img=1", status: "offline" },
  { id: 7, name: "Nanda", avatar: "https://i.pravatar.cc/150?img=1", status: "offline" },
  { id: 8, name: "Alya", avatar: "https://i.pravatar.cc/150?img=1", status: "offline" },
  { id: 9, name: "Linda", avatar: "https://i.pravatar.cc/150?img=1", status: "offline" },
  { id: 10, name: "Maya", avatar: "https://i.pravatar.cc/150?img=1", status: "offline" },
];

const Chat: React.FC = () => {
  const [messages, setMessages] = React.useState<Message[]>([
    { id: 1, senderId: 1, receiverId: null, text: "Hello, everyone!", timestamp: "10:00 AM" },
    { id: 2, senderId: 2, receiverId: null, text: "Hi Alice!", timestamp: "10:01 AM" },
    // { id: 3, senderId: 2, receiverId: -1, text: "Hey, are you free?", timestamp: "10:02 AM" },
    // { id: 4, senderId: -1, receiverId: 2, text: "Yes, what's up?", timestamp: "10:03 AM" },
    // { id: 5, senderId: -1, receiverId: 1, text: "Hello Alice, how are you?", timestamp: "1:03 PM" },
  ]);

  const [newMessage, setNewMessage] = React.useState<string>("");
  const [currentUser, setCurrentUser] = React.useState<User | null>(null); // User yang sedang di-chat
  const [isSidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

  const handleUserSelect = (user: User): void => {
    setCurrentUser(user); // Simpan user yang dipilih
  };

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
      <Header currentUser={currentUser} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}/>

      <Flex flex="1" direction="row">
        {/* Sidebar */}
        <Sidebars users={users} 
          messages={messages} 
          modal={<SelectUser users={users} onUserSelect={handleUserSelect}/>} 
          currentUser={currentUser} 
          setCurrentUser={setCurrentUser} 
          isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} 
          onOpen={() => setSidebarOpen(true)}/>

        {/* Chat Area */}
        <Flex flex="1" direction="column" shadow="lg" rounded="md">
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

          {/* Message Input */}
          <Flex mt={4} shadow="sm" align="center" justify="center">
            <Input
              p={4}
              variant="outline" 
              css={{ "--focus-color": "lime" }}
              placeholder={`ketik Pesan ${currentUser ? `ke ${currentUser.name}` : "ke Semua"}`}
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
          </Flex>
        </Flex>
      </Flex>
    </Flex>
    </>
  );
};

export default Chat;
