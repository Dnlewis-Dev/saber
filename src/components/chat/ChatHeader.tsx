export default function ChatHeader({ title }: { title: string }) {
  return (
    <header className="chat__header">
      <div>
        <h1 className="chat__title">{title}</h1>
        <p className="chat__subtitle"></p>
      </div>
      <span className="statuspill">Offline</span>
    </header>
  );
}