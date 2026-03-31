import Link from 'next/link';
import type { Conversation } from '../../lib/types';

export default function ConversationItem({
  conversation,
  isActive,
}: {
  conversation: Conversation;
  isActive: boolean;
}) {
  return (
    <li className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}>
      <Link className="sidebar__link" href={`/conversations/${conversation.id}`}>
        <div className="sidebar__linkTitle">{conversation.title}</div>
        <div className="sidebar__linkSub">{conversation.subtitle}</div>
      </Link>
    </li>
  );
}