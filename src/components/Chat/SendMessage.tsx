import React from "react";
import { Flex, Textarea, Container } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { LuSendHorizontal } from "react-icons/lu";
import { Session } from "next-auth";
import { supabase } from "@/libs/supabase";
import { User, Message } from "@/libs/types";

interface SendMessageProps {
  session: Session | null;
  currentUser: User | null | undefined;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  editingMessageId: number | null;
}

const SendMessage: React.FC<SendMessageProps> = ({
  session,
  currentUser,
  setMessages,
  messages,
  editingMessageId,
}) => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [editingText, setEditingText] = React.useState("");
  const localTextRef = React.useRef<string>("");
  const broadcast = supabase.channel("typing-status");

  React.useEffect(() => {
    if (editingMessageId) {
      const messageToEdit = messages.find((msg) => msg.id === editingMessageId);
      setEditingText(messageToEdit ? messageToEdit.text : "");
    }
  }, [editingMessageId, messages]);

  const handleTyping = () => {
    if (!inputRef.current || !currentUser) return;

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
      if (inputRef.current) inputRef.current.value = ""; // Kosongkan input setelah mengirim
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    }
  }, [currentUser, setMessages]);

  const handleSaveEditMessage = () => {
    setEditingText("");
  };

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      localTextRef.current = e.target.value;
      setEditingText(e.target.value);
    },
    [setEditingText]
  );

  return (
    <>
      {session && (
        <Container>
          <Flex gap="1" align="center">
            {editingMessageId ? (
              <Textarea
                autoresize
                ref={inputRef}
                value={editingText}
                p={2}
                size="sm"
                className="rounded"
                variant="subtle"
                css={{ "--focus-color": "lineHeights.moderate" }}
                placeholder={`Ketik pesan ${currentUser ? `ke ${currentUser.name}` : "ke Semua"}`}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (editingMessageId) {
                      handleSaveEditMessage();
                    } else {
                      sendMessage();
                    }
                  }
                }}
              />
            ) : (
              <Textarea
                autoresize
                ref={inputRef}
                p={2}
                size="sm"
                className="rounded"
                variant="subtle"
                css={{ "--focus-color": "lineHeights.moderate" }}
                placeholder={`Ketik pesan ${currentUser ? `ke ${currentUser.name}` : "ke Semua"}`}
                onChange={handleTyping}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (editingMessageId) {
                      handleSaveEditMessage();
                    } else {
                      sendMessage();
                    }
                  }
                }}
              />
            )}

            <Button
              ml={2}
              px={3}
              variant="solid"
              bg="blue.500"
              color="white"
              rounded="md"
              _hover={{ bg: "blue.600" }}
              onClick={editingMessageId ? handleSaveEditMessage : sendMessage}
            >
              <LuSendHorizontal /> Send
            </Button>
          </Flex>
        </Container>
      )}
    </>
  );
};

export default SendMessage;
