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
      content: assistantText,
    });

    setMessages((prev) => [...prev, assistantMsg]);
  } catch (err) {
    const errorMsg = await messagesApi.createMessage(activeConversationId, {
      role: 'assistant',
      content: `⚠ OpenRouter failed: ${err?.message || String(err)}`,
    });
    setMessages((prev) => [...prev, errorMsg]);
  } finally {
    setIsLoadingReply(false);
  }
}

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || null;

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