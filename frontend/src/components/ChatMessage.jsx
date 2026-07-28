import { HiOutlineHeart, HiOutlineUser } from 'react-icons/hi2';

function ChatMessage({ message, isUser, isTyping = false }) {
  if (isTyping) {
    return (
      <div className="flex gap-3 animate-fade-in">
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
          <HiOutlineHeart className="w-4 h-4 text-white" />
        </div>
        <div className="chat-bubble-bot flex items-center gap-1.5 py-4">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-accent-500 to-accent-700'
            : 'bg-gradient-to-br from-primary-500 to-primary-700'
        }`}
      >
        {isUser ? (
          <HiOutlineUser className="w-4 h-4 text-white" />
        ) : (
          <HiOutlineHeart className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message bubble */}
      <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        {message.timestamp && (
          <p className={`text-[10px] mt-1.5 ${isUser ? 'text-primary-200/50' : 'text-surface-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
