import { HiOutlineHeart, HiOutlineUser } from 'react-icons/hi2';

function ChatMessage({ message, isUser, isTyping = false }) {
  if (isTyping) {
    return (
      <div className="flex gap-3.5 animate-apple-reveal">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <HiOutlineHeart className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div className="chat-bubble-bot flex items-center gap-2 py-4 px-6">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3.5 animate-apple-reveal ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${
          isUser
            ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-indigo-500/20'
            : 'bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-cyan-500/20'
        }`}
      >
        {isUser ? (
          <HiOutlineUser className="w-5 h-5 text-white" />
        ) : (
          <HiOutlineHeart className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message bubble */}
      <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap font-normal">{message.text}</p>
        {message.timestamp && (
          <p className={`text-[10px] mt-2 font-medium ${isUser ? 'text-sky-200/70' : 'text-slate-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
