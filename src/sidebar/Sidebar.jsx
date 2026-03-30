import NewChatButton from './NewChatButton.jsx';
import ConversationList from './ConversationList.jsx';

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <div className="brand">Saber</div>
        <NewChatButton />
      </div>

      <div className="sidebar__sectionTitle">Conversations</div>

      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
      />
    </aside>
  );
}