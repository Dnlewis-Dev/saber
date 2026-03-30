import ConversationItem from './ConversationItem.jsx';

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
}) {
  return (
    <ul className="sidebar__list">
      {conversations.map((c) => (
        <ConversationItem
          key={c.id}
          conversation={c}
          isActive={c.id === activeConversationId}
          onClick={() => onSelectConversation(c.id)}
        />
      ))}
    </ul>
  );
}