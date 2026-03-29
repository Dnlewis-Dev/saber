class ChatMessage extends HTMLElement {
  connectedCallback() {
    const role = (this.getAttribute('role') || 'bot').toLowerCase();
    const isUser = role === 'user';

    // Ensure it renders with your existing CSS classes
    this.classList.add('message', isUser ? 'user' : 'bot');

    // Normalize content: wrap in <p> if not already
    const raw = this.innerHTML.trim();
    const hasParagraph = raw.startsWith('<p') && raw.includes('</p>');
    this.innerHTML = hasParagraph ? raw : `<p>${raw}</p>`;
  }
}

customElements.define('chat-message', ChatMessage);

(function () {
  const form = document.getElementById('chatForm');
  const input = document.getElementById('messageInput');
  const messagesContainer = document.getElementById('messageList');

  if (!form || !input || !messagesContainer) return;

  const botReplies = [
    'Got it. Want a short example?',
    'Okay — do you mean syntax, DOM, or async?',
    'Noted. What exact output do you expect?',
    'Makes sense. Want me to summarize in 1–2 sentences?',
    'Cool — keep going.',
  ];

  let replyIndex = 0;

  function escapeHtml(str) {
    return str
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function appendMessage(role, text) {
    const el = document.createElement('chat-message');
    el.setAttribute('role', role);
    el.innerHTML = escapeHtml(text);

    messagesContainer.appendChild(el);

    // Keep scrolled to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage) return;

    appendMessage('user', userMessage);

    input.value = '';
    input.focus();

    window.setTimeout(() => {
      const reply = botReplies[replyIndex % botReplies.length];
      replyIndex += 1;
      appendMessage('bot', reply);
    }, 350);
  });
})();
