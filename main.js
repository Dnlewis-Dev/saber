// main.js
import { streamChatCompletion } from './api.js';
import {
  appendMessage,
  createStreamingAssistantMessage,
  appendToStreamingMessage,
  finalizeStreamingMessage,
  scrollMessagesToBottom,
  showSystemMessage,
} from './chat.js';

const MODEL = 'openai/gpt-4o-mini';
const STORAGE_KEY = 'OPENROUTER_API_KEY';

const messages = [];

function getApiKey() {
  let key = localStorage.getItem(STORAGE_KEY);
  if (!key) {
    key = window.prompt(
      'Enter your OpenRouter API key (it will be saved in this browser):',
    );
    if (key) localStorage.setItem(STORAGE_KEY, key.trim());
  }
  return (key || '').trim();
}

function getEls() {
  const form = document.getElementById('chatForm');
  const input = document.getElementById('messageInput');
  const list = document.getElementById('messageList');

  if (!form || !input || !list) {
    throw new Error(
      'Missing required DOM elements: chatForm, messageInput, messageList',
    );
  }
  return { form, input, list };
}

async function onSubmit(e) {
  e.preventDefault();

  const { input, list } = getEls();

  const userText = input.value.trim();
  if (!userText) return;

  input.value = '';
  input.focus();

  appendMessage(list, 'user', userText);
  messages.push({ role: 'user', content: userText });
  scrollMessagesToBottom(list);

  const apiKey = getApiKey();
  if (!apiKey) {
    showSystemMessage(
      list,
      'Missing API key. Add it when prompted and try again.',
    );
    return;
  }

  const streamingEl = createStreamingAssistantMessage(list);
  scrollMessagesToBottom(list);

  let fullAssistantReply = '';

  try {
    //  word-by-word imp
    await streamChatCompletion({
      apiKey,
      model: MODEL,
      messages,
      onDelta: (delta) => {
        if (!delta) return;
        fullAssistantReply += delta;
        appendToStreamingMessage(streamingEl, delta);
        scrollMessagesToBottom(list);
      },
    });

    finalizeStreamingMessage(streamingEl);

    // push complete assistant reply into messages array after stream
    messages.push({ role: 'assistant', content: fullAssistantReply.trim() });
  } catch (err) {
    finalizeStreamingMessage(streamingEl);
    showSystemMessage(list, `Request failed: ${err?.message || String(err)}`);
  }
}

(function init() {
  const { form } = getEls();
  form.addEventListener('submit', onSubmit);
})();
