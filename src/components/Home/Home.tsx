"use client"

import React from "react";
import dynamic from "next/dynamic";
import { Flex } from "@chakra-ui/react";
import Header from "../Header/Header";
import Sidebars from "../Sidebar/Sidebars";
import SelectUser from "../Modal/SelectUser";

const Chat = dynamic(() => import("@/components/Chat/Chat"), { ssr: false })
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

export default function Home() {
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

  return (
    <Flex direction="column" w="100vw" h="100vh" p={4}>
      {/* Header */}
        <Header currentUser={currentUser} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}/>

        <Flex flex="1" direction="row" overflow="hidden">
          {/* Sidebar */}
        <Sidebars users={users} 
          messages={messages} 
          modal={<SelectUser users={users} onUserSelect={handleUserSelect}/>} 
          currentUser={currentUser} 
          setCurrentUser={setCurrentUser} 
          isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} 
          onOpen={() => setSidebarOpen(true)}/>

          {/* Chat Area */}
          <Chat/> 
          
          {/* Message Input */}
          
        </Flex>
    </Flex>
  ) 
}