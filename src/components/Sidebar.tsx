"use client"

import React from "react";
import dynamic from "next/dynamic";

interface User {
  id: number;
  name: string;
  avatar: string; 
  status: string; 
}
interface SidebarProps {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isOpen: boolean; 
  onClose: () => void; 
  onOpen: () => void;
}

const Sidebars = dynamic<SidebarProps>(() => import("@/components/Sidebar/Sidebars"), { ssr: false })

const Sidebar: React.FC<SidebarProps> = ({ users, currentUser, setCurrentUser, isOpen, onClose, onOpen }) => {
  return (
    <Sidebars users={users} 
      currentUser={currentUser} 
      setCurrentUser={setCurrentUser} 
      isOpen={isOpen} 
      onClose={onClose} 
      onOpen={onOpen} /> 
    )
  }

export default Sidebar