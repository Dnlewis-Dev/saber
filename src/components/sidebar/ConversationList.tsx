import type { Conversation } from '../../lib/types';
import ConversationItem from './ConversationItem';

export default function ConversationList({
  conversations,
  activeConversationId,
}: {
  conversations: Conversation[];
  activeConversationId: string;
}) {
  return (
    <ul className="sidebar__list">
      {conversations.map((c) => (
        <ConversationItem
          key={c.id}
          conversation={c}
          isActive={c.id === activeConversationId}
        />
      ))}
    </ul>
  );
}