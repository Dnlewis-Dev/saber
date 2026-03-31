'use client';

import { useState } from 'react';

export default function ChatComposer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => Promise<void>;
  disabled: boolean;
}) {
  const [text, setText] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setText('');
    await onSend(trimmed);
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
      <button className="btn btn--primary" type="submit" disabled={disabled}>
        Send
      </button>
    </form>
  );
}