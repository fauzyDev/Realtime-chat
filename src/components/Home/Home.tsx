"use client"

import React from "react";
import Header from "../Header/Header";
import Sidebars from "../Sidebar/Sidebars";
import SelectUser from "../Modal/SelectUser";
import SendMessage from "../Chat/SendMessage";
import Chat from "@/components/Chat/Chat";
import { FiLogOut } from "react-icons/fi";
import { Button } from "../ui/button";
import { Flex } from "@chakra-ui/react";
import { supabase } from "@/libs/supabase";
import { redis } from "@/libs/redis";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const router = useRouter()
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [users, setUsers] = React.useState<User[]>([])
  const [currentUser, setCurrentUser] = React.useState<User | null>(null); // User yang sedang di-chat
  const [isSidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

  // ambil data users 
  const fetchUsers = async () => {
    try {
      const cacheUsers = (await redis.get("realtime")) as User[]
      if (cacheUsers) {
        setUsers(cacheUsers)
      }

      const { data, error } = await supabase
        .from("users")
        .select()

      if (error) {
        console.error("Terjadi Kesalahan harap refresh halaman", error)
        setUsers([])
        return

      } else {
        setUsers(data)
        await redis.set("realtime", JSON.stringify(data), { ex: 120 })
      }
    } catch (error) {
      console.error("Terjadi Kesalahan harap refresh halaman", error)
    }
  }

  // Mengupdate status user ke online saat login
  const updateStatusToOnline = async (userId: string) => {
    try {
      const cacheStatus = (await redis.get("realtime")) as User[]
      if (cacheStatus) {
        setUsers(cacheStatus)
      }

      const { error } = await supabase
        .from('users')
        .update({ status: 'online' })
        .eq('id', userId);

      if (error) {
        console.error('Error updating status:', error);
        return
      }

      await redis.set("realtime", { ex: 120 })
    } catch (error) {
      console.error('Terjadi kesalahan', error);
    }
  };

  // Dengarkan perubahan data status user secara realtime
  React.useEffect(() => {
    const currentSession = session?.user
    if (typeof currentSession === "string") {
      updateStatusToOnline(currentSession)
    }

    fetchUsers() // ambil users di awal

    const channel = supabase
      .channel("users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          const updateUser = payload.new as User
          setUsers((prevUsers) => prevUsers.map((user) =>
            user.id === updateUser.id ? { ...user, status: updateUser.status } : user));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  React.useEffect(() => {
    const channel = supabase
      .channel("typing-status");

    // Mendengarkan event "mengetik"
    channel.on("broadcast", { event: "mengetik" }, (payload) => {

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === payload.payload.userId ? { ...user, status: "mengetik..." } : user
        )
      );
    });

    // Mendengarkan event "stopped_typing"
    channel.on("broadcast", { event: "stopped_typing" }, (payload) => {

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === payload.payload.userId ? { ...user, status: "online" } : user
        )
      );
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user]);

  const handleLogout = async () => {
    if (!session?.user) return;

    await supabase
      .from("users")
      .update({ status: "offline" })
      .eq("id", session.user);

    router.push("/api/auth/signout")
  };

  React.useEffect(() => {
    const handleUnload = async () => {
      if (!session?.user) return;

      await supabase
        .from("users")
        .update({ status: "offline" })
        .eq("id", session.user);
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [session?.user]);

  // Ambil pesan awal saat pertama kali aplikasi dibuka
  const fetchMessages = async () => {
    try {
      const cacheMessage = (await redis.get("realtime")) as Message[]
      if (cacheMessage) {
        setMessages(cacheMessage)
      }

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Gagal mengambil pesan:", error)
        setMessages([])
        return
      }
      setMessages(data.map(msg => ({ ...msg, timestamp: new Date(msg.created_at) })));
      await redis.set("realtime", JSON.stringify(data.map(msg => ({ ...msg, timestamp: new Date(msg.created_at) }))), { ex: 120 })
    } catch (error) {
      console.error("Terjadi kesalahan", error)
    }
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

          setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

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
          session={session}
          currentUser={users.find(user => user.id === currentUser?.id)}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen} />
      </Flex>

      {/* Sidebar */}
      <Flex flex="1" direction="row" overflow="hidden">
        <Sidebars
          logout={<Button onClick={handleLogout} w="full" size="xs" bg="red.500" _hover={{ bg: "red.700", cursor: "pointer"  }} className="font-semibold text-center text-white"><FiLogOut /> Logout</Button>}
          session={session}
          users={filterUsers}
          messages={messages}
          modal={<SelectUser users={filterUsers} onUserSelect={handleUserSelect} />}
          setCurrentUser={setCurrentUser}
          isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)}
          onOpen={() => setSidebarOpen(true)} />

        {/* Chat Area */}
        <Flex flex="1" direction="column" shadow="md" rounded="md">
          <Flex flex="1" className="[&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500" direction="column" overflowY="auto" p={4}>
            <Chat
              session={session}
              users={users}
              messages={messages}
              currentUser={currentUser} />
          </Flex>

          {/* Message Input */}
          <Flex mb={2} shadow="sm" align="center" justify="center" p={3}>
            <SendMessage
              session={session}
              currentUser={currentUser}
              setMessages={setMessages} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}