export default function ConversationItem({ conversation, isActive, onClick }) {
  return (
    <li className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}>
      <button type="button" className="sidebar__link" onClick={onClick}>
        <div className="sidebar__linkTitle">{conversation.title}</div>
        <div className="sidebar__linkSub">{conversation.subtitle}</div>
      </button>
    </li>
  );
}