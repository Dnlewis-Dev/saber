import type { ChatMessage, Role } from '../types';

export async function listMessages(conversationId: string) {
  const res = await fetch(`/api/conversations/${conversationId}/messages`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load messages');
  return res.json();
}

export async function createMessage(conversationId: string, payload: { role: Role; content: string }) {
  const res = await fetch(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create message');
  return res.json();
}