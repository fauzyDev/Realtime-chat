import React from "react";
import {
  DialogRoot,
  DialogBackdrop,
  DialogTrigger,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { HStack, Text } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { LuMessageCirclePlus } from "react-icons/lu";

interface User {
  id: number;
  name: string;
  avatar: string;
}

const users: User[] = [
  { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/150?img=3" },
];

const SelectUser: React.FC<{ onUserSelect: (user: User) => void }> = ({ onUserSelect }) => {
  const handleUserClick = (user: User) => {
    onUserSelect(user); // Pilih user
  };

  return (
    <DialogRoot>
      {/* Trigger untuk membuka modal */}
      <DialogTrigger asChild>        
        <Button bg="green" color="white" w="full" fontWeight="semibold" mb={4}>
            <LuMessageCirclePlus />
            Chat Baru
        </Button>
      </DialogTrigger>

      {/* Modal Konten */}
      <DialogBackdrop />
      <DialogContent>
        <DialogCloseTrigger asChild>
          <Button position="absolute" top="4" right="4" size="sm">
            X
          </Button>
        </DialogCloseTrigger>

        <DialogHeader>
          <DialogTitle>Pilih User</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {/* Daftar user */}
          {users.map((user) => (
            <HStack
              key={user.id}
              gap={4}
              p={2}
              rounded="md"
              _hover={{ bg: "gray.100", cursor: "pointer" }}
              onClick={() => handleUserClick(user)}
            >
              <Avatar name={user.name} src={user.avatar} />
              <Text fontWeight="bold">{user.name}</Text>
            </HStack>
          ))}
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" onClick={() => console.log("Batal")}>
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default SelectUser;
