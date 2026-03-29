export default function MessageItem({ message }) {
  const cls = message.role === 'user' ? 'message user' : 'message bot';
  return (
    <div className={cls}>
      <p>{message.content}</p>
    </div>
  );
}