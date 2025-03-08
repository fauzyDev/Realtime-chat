import React from "react";
import {
  Text,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";

import { Divide as Hamburger } from 'hamburger-react'
import { Button } from "../ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Session } from 'next-auth';

interface User {
  id: number;
  name: string;
  avatar: string;
  status: string;
}

interface HeaderProps {
  session: Session | null;
  currentUser: User | null | undefined;
  isSidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Header: React.FC<HeaderProps> = ({ session, currentUser, isSidebarOpen, setSidebarOpen }) => {
  return (
    <>
      <Button
        display={{ base: "block", md: "none" }} // Hanya muncul di perangkat kecil
        size="sm">
        <Hamburger size={24} toggled={isSidebarOpen} toggle={setSidebarOpen} />
      </Button>
      {currentUser ? (
        <Text fontSize="xl" display={{ base: "none", md: "block" }} fontWeight="bold">
          Realtime Chat
        </Text>
      ) : (
        <Text fontSize="xl" fontWeight="bold">
          Realtime - All Chat
        </Text>
      )}
      {session && currentUser && (
        <HStack gap={4}>
          <Avatar name={currentUser.name} src={currentUser.avatar} size="sm" />
          <VStack align="start" gap={0}>
            <Text fontSize="sm" fontWeight="bold">
              {currentUser.name}
            </Text>
            <Badge colorPalette={currentUser.status === "online" ? "green" : currentUser.status === "mengetik..." ? "yellow" : "gray"}>
              {currentUser.status}
            </Badge>
          </VStack>
        </HStack>
      )}
      <div></div>
    </>
  );
};

export default Header;
