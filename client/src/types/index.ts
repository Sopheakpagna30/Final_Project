export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface Message {
  _id: string;
  sender: User;
  content: string;
  conversationId: string;
  messageType: 'text' | 'image' | 'file';
  createdAt: string;
  readBy: ReadStatus[];
}

export interface ReadStatus {
  user: string;
  readAt: Date;
}

export interface Conversation {
  _id: string;
  name: string;
  description?: string;
  participants: User[];
  admin: User;
  lastMessage?: Message;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OnlineUser {
  id: string;
  username: string;
  socketId: string;
}

export interface TypingUser {
  userId: string;
  username: string;
  isTyping: boolean;
}