import { formatNotificationTime } from '../../utils/formatters';
import './AI.css';

/**
 * Renders a chat message bubble.
 * Supports minimal markdown: **bold** → <strong>
 */
function renderMarkdownLite(text) {
  // Split on **...** and wrap in <strong>
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function ChatBubble({ message }) {
  const { role, content, timestamp } = message;
  const isUser = role === 'user';

  return (
    <div className={`chat-bubble chat-bubble--${role}`}>
      {/* Bot avatar */}
      {!isUser && (
        <div className="chat-bubble__avatar" aria-hidden="true">🤖</div>
      )}

      <div className="chat-bubble__body">
        <div className="chat-bubble__content" aria-label={`${isUser ? 'You' : 'AI Assistant'}: ${content}`}>
          {renderMarkdownLite(content)}
        </div>
        <span className="chat-bubble__time">
          {formatNotificationTime(timestamp)}
        </span>
      </div>
    </div>
  );
}
