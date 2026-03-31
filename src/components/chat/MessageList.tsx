import type { ChatMessage } from '../../lib/types';
import MessageItem from './MessageItem';

export default function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <section className="messages" aria-label="Message list">
      {messages.map((m) => (
        <MessageItem key={m.id} message={m} />
      ))}
    </section>
  );
}