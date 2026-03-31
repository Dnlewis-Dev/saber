'use client';

import React, {
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ChatMessage, Conversation } from '../../../lib/types';

import Sidebar from '../../../components/sidebar/Sidebar';
import ChatPanel from '../../../components/chat/ChatPanel';

import { listConversations } from '../../../lib/client/conversations';
import { createMessage, listMessages } from '../../../lib/client/messages';
import { requestAssistantReply } from '../../../lib/client/llm';

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: conversationId } = use(params);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingReply, setIsLoadingReply] = useState(false);

  const activeIdRef = useRef(conversationId);

  useEffect(() => {
    activeIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const data = await listConversations();
      if (!cancelled) setConversations(data);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setMessages([]);

    let cancelled = false;

    (async () => {
      const data = await listMessages(conversationId);
      if (!cancelled) setMessages(data);
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === conversationId) ?? null,
    [conversations, conversationId],
  );

  const handleSend = useCallback(
    async (text: string) => {
      const cid = conversationId;

      if (activeIdRef.current !== cid) return;

      const userMsg = await createMessage(cid, { role: 'user', content: text });

      if (activeIdRef.current !== cid) return;
      setMessages((prev) => [...prev, userMsg]);

      setIsLoadingReply(true);

      try {
        const assistantText = await requestAssistantReply(cid, text);

        if (activeIdRef.current !== cid) return;

        const assistantMsg = await createMessage(cid, {
          role: 'assistant',
          content: assistantText,
        });

        if (activeIdRef.current !== cid) return;
        setMessages((prev) => [...prev, assistantMsg]);
      } finally {
        if (activeIdRef.current === cid) setIsLoadingReply(false);
      }
    },
    [conversationId],
  );

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeConversationId={conversationId}
      />
      <ChatPanel
        conversation={activeConversation}
        messages={messages}
        onSend={handleSend}
        isLoadingReply={isLoadingReply}
      />
    </div>
  );
}