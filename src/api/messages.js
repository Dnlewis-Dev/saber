const messagesDb = {
  c1: [
    { id: 'm1', role: 'assistant', content: 'Ask me anything about JavaScript.' },
    { id: 'm2', role: 'user', content: 'What is JavaScript?' },
    { id: 'm3', role: 'assistant', content: 'A language used to make web pages interactive.' },
  ],
  c2: [
    { id: 'm4', role: 'assistant', content: 'CSS helps you style layout and visuals.' },
    { id: 'm5', role: 'user', content: 'How do I center a div?' },
    { id: 'm6', role: 'assistant', content: 'Often: display:flex; justify-content:center; align-items:center.' },
  ],
};

function uid() {
  return `m_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function listMessages(conversationId) {
  const list = messagesDb[conversationId] || [];
  return Promise.resolve([...list]);
}

export function createMessage(conversationId, { role, content }) {
  const msg = { id: uid(), role, content };
  if (!messagesDb[conversationId]) messagesDb[conversationId] = [];
  messagesDb[conversationId].push(msg);
  return Promise.resolve(msg);
}