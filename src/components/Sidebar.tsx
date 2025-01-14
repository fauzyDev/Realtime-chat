"use client";

import React from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
} from "@chakra-ui/react";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Avatar } from "./ui/avatar";

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
}

const Sidebar: React.FC<SidebarProps> = ({ users, currentUser, setCurrentUser }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Sidebar untuk Desktop */}
      <Box
      display={{ base: "none", md: "block" }}
       w="25%" p={4} shadow="lg" rounded="md" mr={4}>
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
         </VStack>
        </Box>

      {/* Sidebar untuk Mobile (Drawer) */}
      <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DrawerBackdrop />
        <DrawerTrigger asChild>
          <Button
            display={{ base: "block", md: "none" }} // Hanya muncul di perangkat kecil
            position="fixed"
            top="16px"
            left="16px"
            zIndex="1000"
            variant="outline"
            size="sm"
          >
           
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Realtime Chat</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" gap={4}>
              <Button
                w="full"
                onClick={() => setCurrentUser(null)}
                bg="blue.600"
                color="white"
                _hover={{ bg: "blue.700" }}
              >
                All Chat
              </Button>
              {users.map((user) => (
                <Button
                  key={user.id}
                  w="full"
                  bg={currentUser?.id === user.id ? "gray.700" : "transparent"}
                  color={currentUser?.id === user.id ? "white" : "gray.300"}
                  _hover={{ bg: "gray.600", color: "white" }}
                  onClick={() => setCurrentUser(user)}
                >
                  {user.name}
                </Button>
              ))}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <DrawerActionTrigger asChild>
              <Button variant="outline">Close</Button>
            </DrawerActionTrigger>
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

export default Sidebar;
