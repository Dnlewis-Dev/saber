export type Role = 'user' | 'assistant';

export type Conversation = {
  id: string;
  title: string;
  subtitle: string;
};

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
};