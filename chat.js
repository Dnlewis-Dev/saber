// chat.js

class ChatMessage extends HTMLElement {
  connectedCallback() {
    const role = (this.getAttribute('role') || 'bot').toLowerCase();
    const isUser = role === 'user';

    this.classList.add('message', isUser ? 'user' : 'bot');

    if (!this.querySelector('p')) {
      const p = document.createElement('p');
      p.textContent = this.textContent || '';
      this.textContent = '';
      this.appendChild(p);
    }
  }

  get p() {
    return this.querySelector('p');
  }

  setText(text) {
    if (this.p) this.p.textContent = text;
  }

  appendText(text) {
    if (this.p) this.p.textContent += text;
  }
}

if (!customElements.get('chat-message')) {
  customElements.define('chat-message', ChatMessage);
}

export function appendMessage(containerEl, role, text) {
  const el = document.createElement('chat-message');
  el.setAttribute('role', role);
  el.textContent = text;
  containerEl.appendChild(el);
  return el;
}

export function createStreamingAssistantMessage(containerEl) {
  const el = appendMessage(containerEl, 'bot', '');
  el.setAttribute('data-streaming', 'true');
  return el;
}

export function appendToStreamingMessage(messageEl, delta) {
  if (messageEl && typeof messageEl.appendText === 'function') {
    messageEl.appendText(delta);
  }
}

export function finalizeStreamingMessage(messageEl) {
  if (messageEl) messageEl.removeAttribute('data-streaming');
}

export function scrollMessagesToBottom(containerEl) {
  containerEl.scrollTop = containerEl.scrollHeight;
}

export function showSystemMessage(containerEl, text) {
  appendMessage(containerEl, 'bot', `⚠ ${text}`);
  scrollMessagesToBottom(containerEl);
}
