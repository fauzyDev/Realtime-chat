"use client";

import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  For,
} from "@chakra-ui/react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "../ui/drawer";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { LuMessageCirclePlus } from "react-icons/lu";
import { FiMessageSquare } from "react-icons/fi";
import Link from "next/link";

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
interface SidebarProps {
  users: User[];
  messages: Message[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isOpen: boolean; 
  onClose: () => void; 
  onOpen: () => void;
}

const Sidebars: React.FC<SidebarProps> = ({ users, messages, currentUser, setCurrentUser, isOpen, onClose, onOpen }) => {
  // Filter user dengan history chat
  const chatHistory = users.filter((user) =>
    messages.some(
      (msg) =>
        (msg.senderId === user.id && msg.receiverId === -1) || // Pesan dari user ke "You"
        (msg.senderId === -1 && msg.receiverId === user.id)    // Pesan dari "You" ke user
    )
  );

  return (
    <>
      {/* Sidebar untuk Desktop */}
      <Box display={{ base: "none", md: "block" }} w="25%" p={4} shadow="lg" rounded="md" mr={4}>
        <Button bg="green" color="white" w="full" fontWeight="semibold" mb={4}>
        <LuMessageCirclePlus />
          Chat Baru
        </Button>

        <Text fontWeight="semibold" mb="3">History Chat</Text>
        <VStack align="stretch">
          {chatHistory.map((user) => (
        <HStack key={user.id}
          gap={4}
          p={2}
          rounded="md"
          _hover={{ bg: "gray.300", cursor: "pointer", color: "black" }}
          onClick={() => setCurrentUser(user)}>
        <Avatar name={user.name} src={user.avatar} />
        <Box>
        <Text fontWeight="bold">{user.name}</Text>
          <Badge colorPalette={user.status === "online" ? "green" : "yellow"}>
            {user.status}
          </Badge>
        </Box>
        </HStack>
        ))}
        <Button onClick={() => setCurrentUser(null)} mt={4} w="full" bg="blue" color="white" fontWeight="semibold">
        <FiMessageSquare />
            All Chat
          </Button>
          <Link href="/api/auth/signin" className="bg-slate-600 font-semibold px-4 py-2 text-center">
            Login
          </Link>
        </VStack>
      </Box>

      {/* Sidebar untuk Mobile (Drawer) */}
      {isOpen && (
      <HStack wrap="wrap">
        <For each={["start"]}>
          {(placement) => (
            <DrawerRoot key={placement} placement={placement} open={isOpen} onOpenChange={(e) => (e.open ? onOpen() : onClose())}>
            <DrawerBackdrop />
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle fontWeight="semibold" fontSize="xl">Realtime Chat</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
              <Button bg="green" color="white" w="full" fontWeight="semibold" mb={4}>
                <LuMessageCirclePlus />
                  Chat Baru
              </Button>

        <Text fontWeight="semibold" mb="3">History Chat</Text>
                <VStack align="stretch" gap={4} onClick={onClose}>
                  {users.map((user) => (
                    <HStack key={user.id}
                    gap={4}
                    p={2}
                    bg={currentUser?.id === user.id ? "transparent" : "transparent" }
                    rounded="md"
                    _hover={{ bg: "gray.300", cursor: "pointer", color: "black" }}
                    onClick={() => setCurrentUser(user)}>
                  <Avatar name={user.name} src={user.avatar} />
                  <Box>
                  <Text fontWeight="bold">{user.name}</Text>
                      <Badge colorPalette={user.status === "online" ? "green" : "yellow"}>
                          {user.status}
                      </Badge>
                  </Box>
                  </HStack>      
                  ))}
                <Button onClick={() => setCurrentUser(null)} mt={4} w="full" bg="blue" color="white" fontWeight="semibold">
                  All Chat
                </Button>
                <Link href="/api/auth/signin" className="bg-slate-600 font-semibold px-4 py-2 text-center">
                    Login
                  </Link>
                </VStack>
              </DrawerBody>
              <DrawerCloseTrigger/>
            </DrawerContent>
          </DrawerRoot>
          )}
        </For>
      </HStack>
      )}
    </>
  );
};

export default Sidebars;
