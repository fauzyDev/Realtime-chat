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
  Button,
} from "@chakra-ui/react";
import { ColorModeToggle } from "@/components/ui/color-mode";
import { Avatar } from "@/components/ui/avatar";

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

const users: User[] = [
  { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/150?img=1", status: "online" },
  { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/150?img=2", status: "typing..." },
];

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, senderId: 1, receiverId: null, text: "Hello, everyone!", timestamp: "10:00 AM" },
    { id: 2, senderId: 2, receiverId: null, text: "Hi Alice!", timestamp: "10:01 AM" },
  ]);

  const [currentUser, setCurrentUser] = useState<User | null>(null); // User yang sedang di-chat
  const [newMessage, setNewMessage] = useState<string>("");

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          senderId: 0, // 0 untuk user saat ini (misalnya, "You")
          receiverId: currentUser?.id || null,
          text: newMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setNewMessage("");
    }
  };

  const filteredMessages = currentUser
    ? messages.filter(
        (msg) =>
          (msg.senderId === currentUser.id && msg.receiverId === 0) ||
          (msg.senderId === 0 && msg.receiverId === currentUser.id)
      )
    : messages;

  return (
    <Flex direction="column" w="100vw" h="100vh" p={4}>
      {/* Header */}
      <Flex justify="space-between" align="center" p={4} shadow="md" rounded="md" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          Realtime Chat {currentUser ? `- Chat with ${currentUser.name}` : "- All Chat"}
        </Text>
        <ColorModeToggle/>
      </Flex>

      <Flex flex="1" direction="row">
        {/* Sidebar */}
        <Box w="30%" p={4} shadow="md" rounded="md" mr={4}>
          <VStack align="stretch">
            {users.map((user) => (
              <HStack
                key={user.id}
                gap={4}
                p={2}
                rounded="md"
                _hover={{ bg: "gray.300", cursor: "pointer", color: "black" }}
                onClick={() => setCurrentUser(user)}
              >
                <Avatar name={user.name} src={user.avatar} />
                <Box>
                  <Text fontWeight="bold">{user.name}</Text>
                  <Badge colorScheme={user.status === "online" ? "green" : "yellow"}>
                    {user.status}
                  </Badge>
                </Box>
              </HStack>
            ))}
            <Button onClick={() => setCurrentUser(null)} mt={4} w="full" bg="blue" color="white" font="semibold">
              All Chat
            </Button>
          </VStack>
        </Box>

        {/* Chat Area */}
        <Flex flex="1" direction="column" p={4} shadow="md" rounded="md">
          <VStack align="stretch" flex="1" overflowY="auto">
            {filteredMessages.map((message) => {
              const sender = users.find((u) => u.id === message.senderId) || { name: "You" };
              return (
                <Box key={message.id} p={3} rounded="md" shadow="sm">
                  <Text fontSize="sm" fontWeight="bold">
                    {sender.name}{" "}
                    <Text as="span" fontWeight="normal" color="gray.500">
                      ({message.timestamp})
                    </Text>
                  </Text>
                  <Text>{message.text}</Text>
                </Box>
              );
            })}
          </VStack>

          {/* Message Input */}
          <Flex mt={4}>
            <Input
              placeholder={`Type a message ${currentUser ? `to ${currentUser.name}` : "to everyone"}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
