import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  For,
  Flex,
  Status
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
import { Session } from 'next-auth';

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
  logout: React.ReactNode
  session: Session | null;
  users: User[];
  messages: Message[];
  setCurrentUser: (user: User | null) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  modal: React.ReactNode
}

const Sidebars: React.FC<SidebarProps> = ({ session, logout, users, messages, modal, setCurrentUser, isOpen, onClose, onOpen }) => {

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
      <Box display={{ base: "none", md: "block" }} w="18%" p={4} shadow="lg" rounded="md" mr={4}>
        {session ? (
          <Flex direction="column" h="full" minH="80vh" position="relative">
            <Button onClick={() => setCurrentUser(null)}
              size="xs"
              mt={1}
              w="full"
              bg="blue.500"
              _hover={{ bg: "blue.700", cursor: "pointer", color: "white" }}
              color="white"
              fontWeight="semibold"
              mb={8}>
              <FiMessageSquare />
              <Text textStyle="sm">All Chat</Text>
            </Button>

            {modal}

            <Text textStyle="sm" fontWeight="semibold" className="mb-6">
              History Chat
            </Text>

            <Flex direction="column" flex="1" overflow="auto" mb={16}>
              {chatHistory.length > 0 ? (
                chatHistory.map((user) => (
                  <HStack key={user.id}
                    mb={8}
                    gap={4}
                    p={2}
                    rounded="md"
                    _hover={{ bg: "gray.600", opacity: 0.8, cursor: "pointer" }}
                    onClick={() => setCurrentUser(user)}>
                    <Avatar size="xs" name={user.name} src={user.avatar} />

                    <Box>
                      <Text textStyle="sm" fontWeight="bold">{user.name}</Text>
                      <Badge
                        size="sm"
                        variant="surface"
                        colorPalette={user.status === "online" ?
                          "green" : user.status === "mengetik..." ?
                          "yellow" : "yellow"}>
                        <Status.Root>
                          <Status.Indicator />{user.status}
                        </Status.Root>
                      </Badge>
                    </Box>
                  </HStack>
                ))
              ) : (
                <Text className="text-center mb-10">Tidak Ada</Text>
              )}
            </Flex>

            <Box position="absolute" bottom="11" w="full" left="0" px={4}>
              {logout}
            </Box>
          </Flex>
        ) : (
          <Link href="/api/auth/signin" className="bg-slate-600 font-semibold px-4 py-2 text-center text-white">
            Login
          </Link>
        )}
      </Box>

      {/* Sidebar untuk Mobile (Drawer) */}
      {isOpen && (
        <HStack wrap="wrap">
          <For each={["start"]}>
            {(placement) => (
              <DrawerRoot key={placement} placement={placement} size="xs" open={isOpen} onOpenChange={(e) => (e.open ? onOpen() : onClose())}>
                <DrawerBackdrop />
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle fontWeight="semibold" fontSize="xl">Realtime Chat</DrawerTitle>
                  </DrawerHeader>
                  <DrawerBody>
                    {session ? <>
                      <Button onClick={() => setCurrentUser(null)} size="xs" mt={1} w="full" bg="blue.500" color="white" fontWeight="semibold" mb={4}>
                        <FiMessageSquare />
                        <Text textStyle="sm">All Chat</Text>
                      </Button>
                      {modal}
                      <Text textStyle="sm" fontWeight="semibold" className="mb-5">History Chat</Text>
                      <VStack align="stretch">
                        {chatHistory.length > 0 ?
                          (chatHistory.map((user) => (
                            <HStack key={user.id}
                              gap={4}
                              p={2}
                              rounded="md"
                              _hover={{ bg: "gray.300", cursor: "pointer", color: "black" }}
                              onClick={() => setCurrentUser(user)}>
                              <Avatar size="xs" name={user.name} src={user.avatar} />
                              <Box>
                                <Text textStyle="sm" fontWeight="bold">{user.name}</Text>
                                <Badge size="xs" colorPalette={user.status === "online" ? "green" : user.status === "mengetik..." ? "yellow" : "gray"}>
                                  {user.status}
                                </Badge>
                              </Box>
                            </HStack>
                          ))
                          ) : (
                            <Text className="text-center mb-10">Tidak Ada</Text>
                          )}
                        {logout}
                      </VStack>
                    </> :
                      <Link href="/api/auth/signin" className="bg-slate-600 font-semibold px-4 py-2 text-center text-white">
                        Login
                      </Link>
                    }
                  </DrawerBody>
                  <DrawerCloseTrigger />
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