export interface User {
    id: number;
    name: string;
    avatar: string;
    status: string;
  }

export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number | null; // Null untuk all-chat
    text: string;
    timestamp: Date;
  }