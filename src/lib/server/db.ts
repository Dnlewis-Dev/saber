import type { ChatMessage, Conversation, Role } from '../types';

declare global {
  var __SABER_DB__:
    | {
        conversations: Conversation[];
        messages: Record<string, ChatMessage[]>;
      }
    | undefined;
}

function uid(prefix = 'm') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export const db =
  globalThis.__SABER_DB__ ??
  (globalThis.__SABER_DB__ = {
    conversations: [
      { id: 'c1', title: 'Chat about JavaScript', subtitle: 'Basics, DOM, async' },
      { id: 'c2', title: 'Help with CSS', subtitle: 'Layout, flex, grid' },
    ],
    messages: {
      c1: [
        {
          id: 'm1',
          role: 'assistant',
          content: 'Ask me anything about JavaScript.',
          createdAt: Date.now() - 100000,
        },
        {
          id: 'm2',
          role: 'user',
          content: 'What is JavaScript?',
          createdAt: Date.now() - 90000,
        },
        {
          id: 'm3',
          role: 'assistant',
          content: 'A language used to make web pages interactive.',
          createdAt: Date.now() - 80000,
        },
      ],
      c2: [
        {
          id: 'm4',
          role: 'assistant',
          content: 'CSS controls layout and visuals.',
          createdAt: Date.now() - 70000,
        },
        {
          id: 'm5',
          role: 'user',
          content: 'How do I center a div?',
          createdAt: Date.now() - 60000,
        },
        {
          id: 'm6',
          role: 'assistant',
          content: 'Try flex: justify-content + align-items.',
          createdAt: Date.now() - 50000,
        },
      ],
    },
  });

export function listConversations() {
  return db.conversations;
}

export function listMessages(conversationId: string) {
  return db.messages[conversationId] ?? [];
}

export function addMessage(conversationId: string, role: Role, content: string) {
  const msg: ChatMessage = {
    id: uid(),
    role,
    content,
    createdAt: Date.now(),
  };
  if (!db.messages[conversationId]) db.messages[conversationId] = [];
  db.messages[conversationId].push(msg);
  return msg;
}