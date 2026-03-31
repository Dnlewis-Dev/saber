export async function requestAssistantReply(conversationId: string, userText: string) {
  const res = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({ conversationId, userText }),
  });

  const data = (await res.json()) as { content?: string; error?: string };
  if (!res.ok) throw new Error(data.error || 'LLM request failed');

  return data.content || '(no reply)';
}