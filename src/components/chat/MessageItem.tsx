import type { ChatMessage } from '../../lib/types';

export default function MessageItem({ message }: { message: ChatMessage }) {
  const cls = message.role === 'user' ? 'message user' : 'message bot';
  return (
    <div className={cls}>
      <p>{message.content}</p>
    </div>
  );
}