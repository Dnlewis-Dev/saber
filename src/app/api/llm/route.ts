export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { listMessages } from '../../../lib/server/db';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

type OpenRouterChatCompletion = {
  choices?: Array<{
    message?: { content?: string };
  }>;
};

export async function POST(req: Request) {
  const { conversationId, userText } = (await req.json()) as {
    conversationId?: string;
    userText?: string;
  };

  const apiKey = (process.env.OPENROUTER_API_KEY ?? '').trim();
  const model = (process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini').trim();

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing OPENROUTER_API_KEY' }, { status: 500 });
  }
  if (!conversationId) {
    return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
  }

  const cleanUserText = (userText ?? '').trim();
  if (!cleanUserText) {
    return NextResponse.json({ error: 'Missing userText' }, { status: 400 });
  }

  // Build history from server DB
  const history = listMessages(conversationId).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Ensure the latest user input is included (no “predetermined” input)
  const last = history[history.length - 1];
  if (!last || last.role !== 'user' || last.content !== cleanUserText) {
    history.push({ role: 'user', content: cleanUserText });
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': new URL(req.url).origin,
      'X-Title': 'Saber Chat (Next.js)',
    },
    body: JSON.stringify({
      model,
      messages: history,
      stream: false,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return NextResponse.json(
      { error: `OpenRouter ${res.status}: ${text || res.statusText}` },
      { status: 502 },
    );
  }

  const json = (await res.json()) as OpenRouterChatCompletion;
  const content = json.choices?.[0]?.message?.content?.trim() ?? '(no reply)';

  return NextResponse.json({ content });
}