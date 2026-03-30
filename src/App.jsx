import { useEffect, useState } from 'react';
import './styles.css';

import Sidebar from './sidebar/Sidebar.jsx';
import ChatPanel from './chat/ChatPanel.jsx';

import * as conversationsApi from './api/conversations.js';
import * as messagesApi from './api/messages.js';
import { requestOpenRouterCompletion } from './api/llm.js';

export default function App() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [isLoadingReply, setIsLoadingReply] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const data = await conversationsApi.listConversations();
      if (cancelled) return;

      setConversations(data);
      if (!activeConversationId && data.length > 0) {
        setActiveConversationId(data[0].id);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []); 

  useEffect(() => {
    if (!activeConversationId) return;

    let cancelled = false;

    (async () => {
      const data = await messagesApi.listMessages(activeConversationId);
      if (cancelled) return;
      setMessages(data);
    })();

    return () => {
      cancelled = true;
    };
  }, [activeConversationId]);

  async function handleSelectConversation(conversationId) {
    setActiveConversationId(conversationId);
  }

  async function handleSendMessage(text) {
  if (!activeConversationId) return;

  const userMsg = await messagesApi.createMessage(activeConversationId, {
    role: 'user',
    content: text,
  });
  setMessages((prev) => [...prev, userMsg]);

  setIsLoadingReply(true);

  try {
    const history = await messagesApi.listMessages(activeConversationId);

    const assistantText = await requestOpenRouterCompletion({
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    });

    const assistantMsg = await messagesApi.createMessage(activeConversationId, {
      role: 'assistant',
      content: '',
    }); 

    setMessages((prev) => [...prev, assistantMsg]);
    //wordbyword
    await typeIntoAssistantMessage({
    conversationId: activeConversationId,
    messageId: assistantMsg.id,
    fullText: assistantText,
    setMessages,})
  } catch (err) {
    const errorMsg = await messagesApi.createMessage(activeConversationId, {
      role: 'assistant',
      content: `⚠ OpenRouter failed: ${err?.message || String(err)}`,
    });
    console.error('OpenRouter error:', err);
    setMessages((prev) => [...prev, errorMsg]);
  } finally {
    setIsLoadingReply(false);
  }
}

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || null;
async function typeIntoAssistantMessage({
  conversationId,
  messageId,
  fullText,
  setMessages,
}) {
  const words = fullText.split(/(\s+)/); // keeps spaces so formatting looks natural
  let built = '';

  for (const chunk of words) {
    built += chunk;

    // update React state
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, content: built } : m)),
    );

    // update mock DB so history remains accurate
    await import('./api/messages.js').then((mod) =>
      mod.updateMessage(conversationId, messageId, { content: built }),
    );

    // speed control (adjust as desired)
    await new Promise((r) => setTimeout(r, 25));
  }
}
  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
      />

      <ChatPanel
        conversation={activeConversation}
        messages={messages}
        onSend={handleSendMessage}
        isLoadingReply={isLoadingReply}
      />
    </div>
  );
}