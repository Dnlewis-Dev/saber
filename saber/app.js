(function () {
  const messageList = document.getElementById('messageList');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('messageInput');

  if (!messageList || !form || !input) return;

  function escapeHtml(str) {
    return str
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function addMessage({ text, author }) {
    const li = document.createElement('li');
    li.className = author === 'user' ? 'msg msg--user' : 'msg msg--bot';

    const safeText = escapeHtml(text);

    li.innerHTML = `
      <div class="msg__bubble">
        <p class="msg__text">${safeText}</p>
        <span class="msg__meta">${author === 'user' ? 'You' : 'Bot'}</span>
      </div>
    `;

    messageList.appendChild(li);
    messageList.scrollTop = messageList.scrollHeight;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    addMessage({ text, author: 'user' });
    input.value = '';
    input.focus();

    // Optional: a fake bot reply to make the UI feel alive (still no real AI).
    window.setTimeout(() => {
      addMessage({
        text: 'Got it — UI message received. (No AI connected yet.)',
        author: 'bot',
      });
    }, 350);
  });
})();
