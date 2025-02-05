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
  sender_id: number;
  receiver_id: number | null; // Null untuk all-chat
  text: string;
  timestamp: Date;
}
interface SidebarProps {
  users: User[];
  messages: Message[];
  setCurrentUser: (user: User | null) => void;
  isOpen: boolean; 
  onClose: () => void; 
  onOpen: () => void;
  modal: React.ReactNode
}

const Sidebars: React.FC<SidebarProps> = ({ users, messages, modal, setCurrentUser, isOpen, onClose, onOpen }) => {
  // Filter user dengan history chat
  const chatHistory = users.filter((user) =>
    messages.some(
      (msg) =>
        (msg.sender_id === user.id && msg.receiver_id !== null) || // Pesan dari user ke "You"
        (msg.receiver_id === user.id)   // Pesan dari "You" ke user
      )
    );

  return (
    <>
      {/* Sidebar untuk Desktop */}
      <Box display={{ base: "none", md: "block" }} w="25%" p={4} shadow="lg" rounded="md" mr={4}>
        {modal}

        <Text fontWeight="semibold" className="mb-5">History Chat</Text>
        <VStack align="stretch">
          {chatHistory.length > 0 ? 
          (chatHistory.map((user) => (
            <HStack key={user.id}
              gap={4}
              p={2}
              rounded="md"
              _hover={{ bg: "gray.300", cursor: "pointer", color: "black" }}
              onClick={() => setCurrentUser(user)}>
            <Avatar name={user.name} src={user.avatar} />
          <Box>
          <Text fontWeight="bold">{user.name}</Text>
            <Badge colorPalette={user.status === "online" ? "green" : user.status === "mengetik..." ? "yellow" : "gray"}>
              {user.status}
            </Badge>
          </Box>
          </HStack>
          )) 
          ) : (
            <Text className="text-center mb-10">Tidak Ada</Text>
          )}
        <Button onClick={() => setCurrentUser(null)} mt={4} w="full" bg="blue" color="white" fontWeight="semibold">
        <FiMessageSquare />
            All Chat
          </Button>
          <Link href="/api/auth/signin" className="bg-slate-600 font-semibold px-4 py-2 text-center text-white">
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
                {modal}
              <Text fontWeight="semibold" mb="3">History Chat</Text>
                <VStack align="stretch" gap={4} onClick={onClose}>
                {chatHistory.length > 0 ? 
                (chatHistory.map((user) => (
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
              )) 
              ) : (
                <Text className="text-center mb-10">Tidak Ada</Text>
              )}
                <Button onClick={() => setCurrentUser(null)} mt={4} w="full" bg="blue" color="white" fontWeight="semibold">
                <FiMessageSquare />
                  All Chat
                </Button>
                <Link href="/api/auth/signin" className="bg-slate-600 font-semibold px-4 py-2 text-center text-white">
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

// pass database fwZZ30wRNAWrAQg5