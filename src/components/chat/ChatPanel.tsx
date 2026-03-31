import type { ChatMessage, Conversation } from '../../lib/types';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatComposer from './ChatComposer';
import TypingIndicator from './TypingIndicator';

export default function ChatPanel({
  conversation,
  messages,
  onSend,
  isLoadingReply,
}: {
  conversation: Conversation | null;
  messages: ChatMessage[];
  onSend: (text: string) => Promise<void>;
  isLoadingReply: boolean;
}) {
  return (
    <main className="chat">
      <ChatHeader title={conversation?.title ?? 'Select a conversation'} />

      <MessageList messages={messages} />

      {isLoadingReply ? <TypingIndicator /> : null}

      <ChatComposer disabled={!conversation || isLoadingReply} onSend={onSend} />
    </main>
  );
}