import type { Conversation } from '../types';

export async function listConversations(): Promise<Conversation[]> {
  const res = await fetch('/api/conversations', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load conversations');
  return res.json();
}