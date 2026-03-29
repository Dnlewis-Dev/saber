(function () {
  const form = document.getElementById('chatForm');
  const input = document.getElementById('messageInput');
  const messagesContainer = document.getElementById('messageList');

  if (!form || !input || !messagesContainer) return;

  const botReplies = [
    'Got it. Want a short example?',
    'Okay — do you mean syntax, DOM, or async?',
    'Noted. What’s the exact output you expect?',
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
    const wrap = document.createElement('div');
    wrap.className = `message ${role}`;

    wrap.innerHTML = `<p>${escapeHtml(text)}</p>`;
    messagesContainer.appendChild(wrap);

    // keep scrolled to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage) return;

    appendMessage('user', userMessage);

    input.value = '';
    input.focus();

    // automated bot response (demo)
    window.setTimeout(() => {
      const reply = botReplies[replyIndex % botReplies.length];
      replyIndex += 1;
      appendMessage('bot', reply);
    }, 350);
  });
})();
