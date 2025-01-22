import React from "react";
import {
  Flex,
  Text,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { ColorModeToggle } from "@/components/ui/color-mode";
import { Spin as Hamburger } from 'hamburger-react'
import { Button } from "../ui/button";
import { Avatar } from "@/components/ui/avatar";

interface User {
    id: number;
    name: string;
    avatar: string; 
    status: string; 
}

interface HeaderProps {
    currentUser: User | null;
    isSidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Header: React.FC<HeaderProps> = ({ currentUser, isSidebarOpen, setSidebarOpen }) => {
  return (
    <Flex justify="space-between" align="center" p={4} shadow="lg" rounded="md" mb={4}>
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
      {currentUser && (
        <HStack gap={4}>
          <Avatar name={currentUser.name} src={currentUser.avatar} size="sm" />
          <VStack align="start" gap={0}>
            <Text fontSize="sm" fontWeight="bold">
              {currentUser.name}
            </Text>
            <Badge colorPalette={currentUser.status === "online" ? "green" : "yellow"}>
              {currentUser.status}
            </Badge>
          </VStack>
        </HStack>
      )}
      <ColorModeToggle />
    </Flex>
  );
};

export default Header;
