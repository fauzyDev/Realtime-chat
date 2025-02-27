import React from "react";
import {
  List,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";

import { Avatar } from "@/components/ui/avatar";
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

interface ChatProps {
  session: Session | null;
  messages: Message[];
  currentUser: User | null;
  users: User[];
}
const Chat: React.FC<ChatProps> = ({ session, users, messages, currentUser }) => {

  // Filter pesan berdasarkan pengguna yang sedang di-chat
  const filteredMessages = currentUser ?
    messages.filter(
      (msg) =>
        (msg.sender_id === currentUser.id && msg.receiver_id !== null) || // Pesan dari user ke penerima
        (msg.receiver_id === currentUser.id && msg.sender_id !== null) // Pesan dari penerima ke user
    ) : messages.filter( (msg) => msg.receiver_id === null); // All-chat
    const allChat = filteredMessages.some((msg) => msg.receiver_id === null)

  return (
    <>
      <VStack align="stretch" flex="1" overflowY="auto" p={4} gap={4}>
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => {
            const sender = message.sender_id === session?.user
            
            const senderUser = users.find((u) => u.id === message.sender_id) || null;
            const receiverUser = users.find((u) => u.id === message.receiver_id) || null;

            const isUser = senderUser ?? receiverUser ?? { name: "", avatar: undefined }
             
            return (
              <HStack key={message.id} align="start" gap={3} p={3} rounded="md" justifyContent={allChat ? "flex-start" : sender ? "flex-end" : "flex-start"}>
                {/* sender avatar di sebelah kiri */}
                {allChat || !sender ? ( <Avatar name={isUser.name ?? undefined} src={isUser.avatar ?? undefined} size="sm" /> )  : null}
                {/* {!allChat || sender ? ( <Avatar name={isUser.name ?? undefined} src={isUser.avatar ?? undefined} size="sm" /> ) : null} */}
                {/* Konten pesan */}
                <List.Root bg={allChat ? "gray.700" : sender ? "blue.600" : "gray.700"} maxWidth={{ sm: "60%", md: "50%" }} wordBreak="break-word" className="border border-gray-200 rounded-2xl p-4 space-y-3  dark:border-neutral-600/65">
                  <Text fontSize="sm" fontWeight="bold">
                    {isUser.name}
                    <Text as="span" fontWeight="normal" color="gray.500">
                      ({message.timestamp instanceof Date ? message.timestamp.toLocaleTimeString("jkt-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                      }) : "Waktu tidak ada"})
                    </Text>
                  </Text>
                  <Text>{message.text}</Text>
                </List.Root>
                  {/* receiver avatar di sebelah kanan */}
                  {sender && !allChat && <Avatar name={isUser.name ?? undefined} src={isUser.avatar ?? undefined} size="sm" /> }
              </HStack>
            );
          })
        ) : (
          <Text>Tidak ada pesan silahkan kirm pesan</Text>
        )}
      </VStack>
    </>
  );
};

export default Chat;
