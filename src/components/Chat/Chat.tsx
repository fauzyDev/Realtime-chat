import React, { RefObject } from "react";
import {
  List,
  Text,
  VStack,
  HStack,
  Menu,
  Portal
} from "@chakra-ui/react";

import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaArrowDown } from "react-icons/fa";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Session } from 'next-auth';
import { User, Message } from "@/libs/types";

interface ChatProps {
  session: Session | null;
  messages: Message[];
  currentUser: User | null;
  users: User[];
  scroll: RefObject<HTMLDivElement>;
  chatContainer: RefObject<HTMLDivElement>;
  handleScroll: VoidFunction;
  showScrollButton: boolean;
  scrollToBottom: VoidFunction;
  handleEditClick: (message) => void
}

const Chat: React.FC<ChatProps> = ({ session, users, messages, currentUser, scroll, chatContainer, handleScroll, showScrollButton, scrollToBottom, handleEditClick }) => {

  // Filter pesan berdasarkan pengguna yang sedang di-chat
  const filteredMessages = currentUser ?
    messages.filter(
      (msg) =>
        (msg.sender_id === currentUser.id && msg.receiver_id !== null) || // Pesan dari user ke penerima
        (msg.receiver_id === currentUser.id && msg.sender_id !== null) // Pesan dari penerima ke user
    ) : messages.filter((msg) => msg.receiver_id === null); // All-chat

  const allChat = filteredMessages.some((msg) => msg.receiver_id === null) // filter room all-chat

  return (
    <>
      <VStack ref={chatContainer} onScroll={handleScroll} align="stretch" flex="1" overflowY="auto" p={4} gap={4}>
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => {
            const sender = message.sender_id === session?.user

            const senderUser = users.find((u) => u.id === message.sender_id) || null;
            const receiverUser = users.find((u) => u.id === message.receiver_id) || null;

            const isUser = senderUser ?? receiverUser ?? { name: "", avatar: undefined }

            return (
              <HStack key={message.id} align="start" position="relative" gap={3} p={3} rounded="md" justifyContent={allChat ? "flex-start" : sender ? "flex-end" : "flex-start"}>
                {/* avatar di sebelah kiri */}
                {allChat || !sender ? (<Avatar name={isUser.name ?? undefined} src={isUser.avatar ?? undefined} size="sm" />) : null}

                {/* Konten pesan */}
                <List.Root position="relative" bg={allChat ? "gray.700" : sender ? "blue.600" : "gray.700"} shadow="sm" mb={6} maxWidth={{ sm: "60%", md: "50%" }} wordBreak="break-word" borderRadius="md" className="border border-gray-200 rounded p-4 space-y-3  dark:border-neutral-600/65">
                  {/* Menu Opsi (Edit & Hapus) */}
                  {sender && (
                    <Menu.Root>
                      <Menu.Trigger asChild>
                        <Button variant="outline" size="xs" position="absolute" top="-1" right="-1" aria-label="options">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Menu.Trigger>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content>
                            <Menu.Item value="edit" onClick={() => handleEditClick(message)}>Edit</Menu.Item>
                            <Menu.Item
                              value="delete"
                              color="fg.error"
                              _hover={{ bg: "bg.error", color: "fg.error" }}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                  )}
                  <Text fontSize="sm" fontWeight="bold">
                    {isUser.name}
                    <Text as="span" fontWeight="normal" color="gray.300">
                      {""} ({message.timestamp instanceof Date ? message.timestamp.toLocaleTimeString("jkt-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                      }) : "Waktu tidak ada"})
                    </Text>
                  </Text>
                  <Text textStyle="md">{message.text}</Text>
                </List.Root>
                {/* avatar di sebelah kanan */}
                {sender && !allChat && <Avatar name={isUser.name ?? undefined} src={isUser.avatar ?? undefined} size="sm" />}
              </HStack>
            );
          })
        ) : (
          <Text>Tidak ada pesan silahkan kirm pesan</Text>
        )}
        <div ref={scroll}></div>
        {showScrollButton && (
          <Button
            size="sm"
            className="rounded-full"
            position="absolute"
            bottom="20px"
            right="10"
            bg="blue.500"
            onClick={scrollToBottom}>
            <FaArrowDown />
          </Button>
        )}
      </VStack>
    </>
  );
};

export default Chat;
