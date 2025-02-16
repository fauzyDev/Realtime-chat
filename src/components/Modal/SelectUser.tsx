import React from "react";
import {
  DialogRoot,
  DialogTrigger,
  DialogActionTrigger,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { HStack, Box, Badge, Text } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { LuMessageCirclePlus } from "react-icons/lu";

interface User {
  id: number;
  name: string;
  avatar: string;
  status: string;
}

interface ModalProps {
  users: User[];
  onUserSelect: (user: User) => void;
 
}

const SelectUser: React.FC<ModalProps> = ({ users, onUserSelect }) => {
  return (
    <DialogRoot scrollBehavior="inside" size="xs">
      {/* Trigger untuk membuka modal */}
      <DialogTrigger asChild>        
        <Button bg="green.500" size="xs" color="white" w="full" fontWeight="semibold" mb={4}>
            <LuMessageCirclePlus />
            Chat Baru
        </Button>
      </DialogTrigger>

      {/* Modal Konten */}
      <DialogContent>
        <DialogCloseTrigger asChild/>

        <DialogHeader>
          <DialogTitle>Pilih User</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {/* Daftar user */}
          {users.length > 0 ? (
            users.map((user) => (
              <DialogActionTrigger asChild key={user.id}>
                <HStack 
                  gap={4}
                  p={2}
                  rounded="md"
                  _hover={{ bg: "gray.300", cursor: "pointer", color: "black" }}
                  onClick={() => onUserSelect(user)}>
                  <Avatar name={user.name} src={user.avatar} />
                <Box>
                  <Text fontWeight="bold">{user.name}</Text>
                    <Badge colorPalette={user.status === "online" ? "green" : user.status === "mengetik..." ? "yellow" : "gray"}>
                      {user.status}
                    </Badge>
                  </Box>
                </HStack>
              </DialogActionTrigger>
              ))
          ) : ( <p>Tidak ada user</p> ) }
          
        </DialogBody>
        <DialogFooter/>
      </DialogContent>
    </DialogRoot>
  );
};

export default SelectUser;
