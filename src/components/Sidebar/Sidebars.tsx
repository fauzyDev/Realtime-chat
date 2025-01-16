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

interface User {
  id: number;
  name: string;
  avatar: string; 
  status: string; 
}

interface SidebarProps {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isOpen: boolean; 
  onClose: () => void; 
  onOpen: () => void;
}

const Sidebars: React.FC<SidebarProps> = ({ users, currentUser, setCurrentUser, isOpen, onClose, onOpen }) => {
  return (
    <>
      {/* Sidebar untuk Desktop */}
      <Box display={{ base: "none", md: "block" }} w="25%" p={4} shadow="lg" rounded="md" mr={4}>
        <VStack align="stretch">
          {users.map((user) => (
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
            All Chat
          </Button>
          <Button onClick={() => null} bg="gray.500" color="white" fontWeight="semibold">
                  Login
                </Button>
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
                <DrawerTitle fontWeight="semibold">Realtime Chat</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
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
                <Button onClick={() => null} bg="gray.500" color="white" fontWeight="semibold">
                  Login
                </Button>
                </VStack>
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
