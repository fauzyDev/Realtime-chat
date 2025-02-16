"use client"

import React from "react";
import dynamic from "next/dynamic";
import { Flex } from "@chakra-ui/react";
import Header from "../Header/Header";
// import Sidebars from "../Sidebar/Sidebars";
import SelectUser from "../Modal/SelectUser";
import SendMessage from "../Chat/SendMessage";
import { supabase } from "@/libs/supabase";
import { useSession } from "next-auth/react"

const Chat = dynamic(() => import("@/components/Chat/Chat"), { ssr: false })
const Sidebars = dynamic(() => import("../Sidebar/Sidebars"), { ssr: true })

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

export default function Home() {
    const { data: session } = useSession()
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [newMessage, setNewMessage] = React.useState<string>("");
    const [users, setUsers] = React.useState<User[]>([])
    const [currentUser, setCurrentUser] = React.useState<User | null>(null); // User yang sedang di-chat
    const [isSidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

    // ambil data users 
    const fetchUsers = async () => {
      const { data, error } = await supabase
      .from("users")
      .select()

      if (error) {
        console.error("Gagal", error)
        return
      }
      setUsers(data)
    }

    // Dengarkan perubahan data status user secara realtime
    React.useEffect(() => {
      fetchUsers() // ambil users di awal

      const channel = supabase
        .channel("users")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "users" },
          (payload) => {
            console.log("User Status:", payload.new);
            setUsers((prevUsers) => prevUsers.map((user) =>
            user.id === payload.new.id ? { ...user, status: payload.new.status } : user ));
          }
        )
        .subscribe();
  
      return () => {
        supabase.removeChannel(channel);
      };
    }, [session?.user]);

    // Ambil pesan awal saat pertama kali aplikasi dibuka
    const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Gagal mengambil pesan:", error) 
      return
    }
    setMessages(data.map(msg => ({ ...msg, timestamp: new Date(msg.created_at) })));
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
  }, [session?.user]);

    // fungsi untuk memilih user yang akan di chat 
    const handleUserSelect = (user: User): void => {
      setCurrentUser(user); // Simpan user yang dipilih
      setSidebarOpen(false) // menutup sidebar
    };

  // filter user berdasarkan session
  const currentUserId = session?.user;
  const filterUsers = users.filter((user) => user.id !== currentUserId);

  return (
    <Flex direction="column" w="100vw" h="100vh" bg="bg.subtle" p={4}>
    {/* Header */}
    <Flex as="header" justify="space-between" align="center" p={4} shadow="md" rounded="md" mb={4}>
      <Header 
        currentUser={currentUser} 
        isSidebarOpen={isSidebarOpen} 
        setSidebarOpen={setSidebarOpen}/>
      </Flex>

    {/* Sidebar */}
    <Flex flex="1" direction="row" overflow="hidden">
      <Sidebars 
        session={session}
        users={filterUsers} 
        messages={messages} 
        modal={<SelectUser users={filterUsers} onUserSelect={handleUserSelect}/>} 
        setCurrentUser={setCurrentUser} 
        isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} 
        onOpen={() => setSidebarOpen(true)}/>

    {/* Chat Area */}
    <Flex flex="1" direction="column" shadow="md" rounded="md">
      <Flex flex="1" direction="column" overflowY="auto" p={4}>
        <Chat
          users={users}
          messages={messages}
          currentUser={currentUser}/> 
        </Flex>
          
    {/* Message Input */}
    <Flex mb={2} shadow="sm" align="center" justify="center" p={3}>
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