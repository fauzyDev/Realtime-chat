"use client"

import React from "react";
import dynamic from "next/dynamic";

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
interface SidebarProps {
  users: User[];
  messages: Message[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isOpen: boolean; 
  onClose: () => void; 
  onOpen: () => void;
}

const Sidebars = dynamic<SidebarProps>(() => import("@/components/Sidebar/Sidebars"), { ssr: false })

const Sidebar: React.FC<SidebarProps> = ({ users, messages, currentUser, setCurrentUser, isOpen, onClose, onOpen }) => {
  return (
    <Sidebars users={users}
      messages={messages} 
      currentUser={currentUser} 
      setCurrentUser={setCurrentUser} 
      isOpen={isOpen} 
      onClose={onClose} 
      onOpen={onOpen} /> 
    )
  }

export default Sidebar