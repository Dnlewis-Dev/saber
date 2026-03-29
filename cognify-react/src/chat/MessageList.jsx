import MessageItem from './MessageItem.jsx';

export default function MessageList({ messages }) {
  return (
    <section className="messages" aria-label="Message list">
      {messages.map((m) => (
        <MessageItem key={m.id} message={m} />
      ))}
    </section>
  );
}