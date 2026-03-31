import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="home">
      <h1>Saber Chat</h1>
      <p>Open a conversation to start.</p>
      <Link className="home__link" href="/conversations/c1">
        Lets go!
      </Link>
    </div>
  );
}