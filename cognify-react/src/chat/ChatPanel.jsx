import ChatHeader from './ChatHeader.jsx';
import MessageList from './MessageList.jsx';
import ChatComposer from './ChatComposer.jsx';
import TypingIndicator from './TypingIndicator.jsx';

export default function ChatPanel({ conversation, messages, onSend, isLoadingReply }) {
  return (
    <main className="chat">
      <ChatHeader title={conversation?.title || 'Select a conversation'} />

      <MessageList messages={messages} />

      {isLoadingReply ? <TypingIndicator /> : null}

      <ChatComposer onSend={onSend} disabled={!conversation || isLoadingReply} />
    </main>
  );}