import type { Conversation } from '../../lib/types';
import ConversationList from './ConversationList';
import NewChatButton from './NewChatButton';

export default function Sidebar({
  conversations,
  activeConversationId,
}: {
  conversations: Conversation[];
  activeConversationId: string;
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <div className="brand">Saber</div>
        <NewChatButton/>
      </div>

      <div className="sidebar__sectionTitle">Conversations</div>

      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
      />
    </aside>
  );
}