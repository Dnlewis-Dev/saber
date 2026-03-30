const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const OPENROUTER_API_KEY = '...';
console.log('OPENROUTER_API_KEY length:', OPENROUTER_API_KEY?.trim()?.length);
const MODEL = 'openai/gpt-4o-mini';

export async function requestOpenRouterCompletion({ messages }) {
  if (OPENROUTER_API_KEY.trim().length === 0) {
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