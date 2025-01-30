"use client"

import React from "react";
import dynamic from "next/dynamic";
import { Flex } from "@chakra-ui/react";
import Header from "../Header/Header";
import Sidebars from "../Sidebar/Sidebars";
import SelectUser from "../Modal/SelectUser";
import SendMessage from "../Chat/SendMessage";
import { supabase } from "@/libs/supabase";

const Chat = dynamic(() => import("@/components/Chat/Chat"), { ssr: false })
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
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [newMessage, setNewMessage] = React.useState<string>("");
    const [currentUser, setCurrentUser] = React.useState<User | null>(null); // User yang sedang di-chat
    const [isSidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

    // Ambil pesan awal saat pertama kali aplikasi dibuka
    const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) console.error("Gagal mengambil pesan:", error);
    else setMessages(data);
  };

  React.useEffect(() => {
    fetchMessages(); // Ambil pesan awal

    // Dengarkan perubahan data secara realtime
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          console.log("Pesan baru diterima:", payload.new);
          setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
    const handleUserSelect = (user: User): void => {
      setCurrentUser(user); // Simpan user yang dipilih
      setSidebarOpen(false)
    };

  return (
    <Flex direction="column" w="100vw" h="100vh" p={4}>
    {/* Header */}
    <Flex as="header" justify="space-between" align="center" p={4} shadow="lg" rounded="md" mb={4}>
      <Header 
        currentUser={currentUser} 
        isSidebarOpen={isSidebarOpen} 
        setSidebarOpen={setSidebarOpen}/>
      </Flex>

    {/* Sidebar */}
    <Flex flex="1" direction="row" overflow="hidden">
      <Sidebars 
        users={users} 
        messages={messages} 
        modal={<SelectUser users={users} onUserSelect={handleUserSelect}/>} 
        setCurrentUser={setCurrentUser} 
        isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} 
        onOpen={() => setSidebarOpen(true)}/>

    {/* Chat Area */}
    <Flex flex="1" direction="column" shadow="lg" rounded="md">
      <Flex flex="1" direction="column" overflowY="auto" p={4}>
        <Chat
          users={users}
          messages={messages}
          currentUser={currentUser}/> 
        </Flex>
          
    {/* Message Input */}
    <Flex mb={2} shadow="sm" align="center" justify="center">
        <SendMessage 
          messages={messages} 
          newMessage={newMessage} 
          currentUser={currentUser} 
          setMessages={setMessages}
          setNewMessage={setNewMessage}/>
        </Flex>
      </Flex>  
    </Flex>
  </Flex>
  ) 
}