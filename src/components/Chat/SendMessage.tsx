import React from 'react';
import { Flex, Textarea, Container } from "@chakra-ui/react"
import { Button } from "../ui/button";
import { LuSendHorizontal } from "react-icons/lu";
import { Session } from 'next-auth';
import { supabase } from '@/libs/supabase';
import { User, Message } from '@/libs/types';

interface SendMessageProps {
  session: Session | null;
  currentUser: User | null | undefined;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  editingMessageId: number | null;
  editingText: string;
  setEditingText: React.Dispatch<React.SetStateAction<string>>;
}

const SendMessage: React.FC<SendMessageProps> = ({ session, currentUser, setMessages, editingMessageId, editingText, setEditingText }) => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const newMessageRef = React.useRef<string>("");
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const broadcast = supabase.channel("typing-status");

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!inputRef.current || !currentUser) return;

    inputRef.current.value = e.target.value;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Kirim event "mengetik"
    broadcast.send({
      type: "broadcast",
      event: "mengetik",
      payload: { userId: session.user },
    });

    // Set timeout untuk menghapus status mengetik jika user berhenti mengetik dalam 2 detik
    typingTimeoutRef.current = setTimeout(() => {
      broadcast.send({
        type: "broadcast",
        event: "stopped_typing",
        payload: { userId: session.user },
      });
    }, 2000);
  };

  // Fungsi untuk mengirim pesan
  const sendMessage = React.useCallback(async () => {
    const newMessage = inputRef.current.value;
    if (!newMessage.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newMessage,
          receiver_id: currentUser?.id ?? null, // Null untuk all-chat
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim pesan");
      }

      const data = await response.json();

      const newMsg: Message = {
        id: data.id,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        text: data.text,
        timestamp: new Date(data.created_at),
      };

      setMessages((prev) => [...prev, newMsg]); // Tambahkan pesan baru ke daftar
      // newMessageRef.current = ""
      if (inputRef.current) inputRef.current.value = ""; // Kosongkan input setelah mengirim
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    }
  }, [currentUser, setMessages]);

  const saveEditedMessage = () => {
    setEditingText("");
  };

  return (
    <>
      {session && (
        <Container>
          <Flex gap="1" align="center">
            <Textarea
              autoresize
              ref={inputRef}
              defaultValue={editingMessageId ? undefined : ""}
              value={editingMessageId ? editingText : undefined}
              p={2}
              size="sm"
              className="rounded"
              variant="subtle"
              css={{ "--focus-color": "lineHeights.moderate" }}
              placeholder={`Ketik pesan ${currentUser ? `ke ${currentUser.name}` : "ke Semua"}`}
              onChange={(e) => {
                if (editingMessageId) {
                  setEditingText(e.target.value);
                } else {
                  newMessageRef.current = e.target.value;
                  handleTyping(e);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (editingMessageId) {
                    saveEditedMessage();
                  } else {
                    sendMessage();
                  }
                }
              }}
            />

            <Button
              ml={2}
              px={3}
              variant="solid"
              bg="blue.500"
              color="white"
              rounded="md"
              _hover={{ bg: "blue.600" }}
              onClick={editingMessageId ? saveEditedMessage : sendMessage}>
              <LuSendHorizontal /> Send
            </Button>
          </Flex>
        </Container>
      )}
    </>
  );
};

export default SendMessage;
