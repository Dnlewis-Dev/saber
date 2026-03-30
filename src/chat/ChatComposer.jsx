import { useState } from 'react';

export default function ChatComposer({ onSend, disabled }) {
  const [text, setText] = useState('');

  async function submit(e) {
  e.preventDefault();
  const trimmed = text.trim();
  if (!trimmed) return;

  setText('');

  try {
    await onSend(trimmed);
  } catch (err) {
    console.error(err);
  }
}

  return (
    <form className="input-area" onSubmit={submit} autoComplete="off">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={disabled ? 'Select a conversation…' : 'Type your message…'}
        disabled={disabled}
        maxLength={500}
      />
      <button type="submit" className="btn btn--primary" disabled={disabled}>
        Send
      </button>
    </form>
  );
}