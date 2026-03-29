// api.js
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function streamChatCompletion({
  //apiKey,
  model,
  messages,
  onDelta,
}) {
  const apiKey =
    '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';
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',

      'HTTP-Referer': window.location.origin,
      'X-Title': 'Saber Chat (Web Dev course)',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  });

  if (!res.ok) {
    const text = await safeReadText(res);
    throw new Error(
      `OpenRouter error ${res.status}: ${text || res.statusText}`,
    );
  }

  if (!res.body) {
    throw new Error('No response body (stream unavailable).');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');

  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;

      const data = trimmed.slice('data:'.length).trim();
      if (!data) continue;

      if (data === '[DONE]') return;

      try {
        const json = JSON.parse(data);
        const delta = json?.choices?.[0]?.delta?.content ?? '';
        if (delta) onDelta(delta);
      } catch {
        // ignore
      }
    }
  }
}

async function safeReadText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}
