// src/api/llm.js
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Put your key here for local dev (do NOT commit to public repos)
const OPENROUTER_API_KEY = 'PASTE_KEY_HERE';

// pick a model you have access to
const MODEL = 'openai/gpt-4o-mini';

export async function requestOpenRouterCompletion({ messages }) {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'PASTE_KEY_HERE') {
    throw new Error('Missing OpenRouter API key in src/api/llm.js');
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Saber Chat (React)',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: false,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OpenRouter ${res.status}: ${text || res.statusText}`);
  }

  const json = await res.json();
  return json?.choices?.[0]?.message?.content?.trim() || '(no reply)';
}