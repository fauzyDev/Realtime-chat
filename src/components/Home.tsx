"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Input,
  Text,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { ColorModeToggle } from "./ui/color-mode";
import { Avatar } from "./ui/avatar";

interface User {
  id: number;
  name: string;
  avatar: string;
  status: string;
}

interface Message {
  id: number;
  user: string;
  text: string;
  timestamp: string;
}

const users: User[] = [
  {
    id: 1,
    name: "Alice",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "online",
  },
  {
    id: 2,
    name: "Bob",
    avatar: "https://i.pravatar.cc/150?img=2",
    status: "typing...",
  },
];

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: "Alice", text: "Hello!", timestamp: "10:00 AM" },
    { id: 2, user: "Bob", text: "Hi there!", timestamp: "10:01 AM" },
  ]);

  const [newMessage, setNewMessage] = useState<string>("");
//   const { colorMode } = useColorMode(); // Ambil mode warna (light/dark)

  // Definisikan warna secara manual
//   const bgColor = colorMode === "light" ? "white" : "gray.800";
//   const sidebarBgColor = colorMode === "light" ? "gray.50" : "gray.900";
//   const textColor = colorMode === "light" ? "gray.800" : "gray.100";
//   const inputBgColor = colorMode === "light" ? "gray.50" : "gray.700";
//   const inputTextColor = colorMode === "light" ? "gray.800" : "gray.200";

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          user: "You",
          text: newMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <Flex direction="column" w="100vw" h="100vh" p={4} 
    // bg={sidebarBgColor}
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        // bg={bgColor}
        p={4}
        shadow="md"
        rounded="md"
        mb={4}
      >
        <Text fontSize="xl" fontWeight="bold" 
        // color={textColor}
        >
          Realtime Chat
        </Text>
        <ColorModeToggle />
      </Flex>

      <Flex flex="1" direction="row">
        {/* Sidebar */}
        <Box
          w="30%"
        //   bg={bgColor}
          p={4}
          shadow="md"
          rounded="md"
          mr={4}
        >
          <VStack align="stretch">
            {users.map((user) => (
              <HStack
                key={user.id}
                gap={4}
                p={2}
                rounded="md"
                // _hover={{
                //   bg: colorMode === "light" ? "gray.100" : "gray.700",
                // }}
              >
                <Avatar name={user.name} src={user.avatar} />
                <Box>
                  <Text fontWeight="bold" 
                //   color={textColor}
                  >
                    {user.name}
                  </Text>
                  <Badge
                    colorScheme={user.status === "online" ? "green" : "yellow"}
                  >
                    {user.status}
                  </Badge>
                </Box>
              </HStack>
            ))}
          </VStack>
        </Box>

        {/* Chat Area */}
        <Flex
          flex="1"
          direction="column"
        //   bg={bgColor}
          p={4}
          shadow="md"
          rounded="md"
        >
          <VStack align="stretch" flex="1" overflowY="auto">
            {messages.map((message) => (
              <Box
                key={message.id}
                p={3}
                // bg={colorMode === "light" ? "gray.100" : "gray.700"}
                rounded="md"
                shadow="sm"
              >
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                //   color={textColor}
                >
                  {message.user}{" "}
                  <Text as="span" fontWeight="normal" color="gray.500">
                    ({message.timestamp})
                  </Text>
                </Text>
                <Text>{message.text}</Text>
              </Box>
            ))}
          </VStack>

          {/* Message Input */}
          <Flex mt={4}>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            //   bg={inputBgColor}
            //   color={inputTextColor}
            />
            <Box
              as="button"
              ml={2}
              px={4}
              py={2}
              bg="blue.500"
              color="white"
              rounded="md"
              _hover={{ bg: "blue.600" }}
              onClick={sendMessage}
            >
              Send
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Chat;
