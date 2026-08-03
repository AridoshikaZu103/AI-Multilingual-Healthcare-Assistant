import { useState, useRef, useEffect } from 'react';
import { HiOutlinePaperAirplane, HiOutlineSparkles, HiSparkles } from 'react-icons/hi2';
import ChatMessage from './ChatMessage';

function ChatWindow({ messages, onSendMessage, isLoading, t }) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = t('chat.suggestions') || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (isLoading) return;
    onSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-apple-reveal my-auto">
            {/* Welcome hero icon */}
            <div className="relative group mb-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30 group-hover:scale-110 transition-all duration-500">
                <HiOutlineSparkles className="w-12 h-12 text-white animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-3xl bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-extrabold tracking-tight gradient-text">
                {t('chat.title')}
              </h2>
              <HiSparkles className="w-6 h-6 text-cyan-400 animate-spin-slow" />
            </div>

            <p className="text-slate-300 text-sm max-w-lg mb-10 leading-relaxed font-normal">
              {t('chat.welcome')}
            </p>

            {/* Suggestion chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
              {Array.isArray(suggestions) && suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  id={`suggestion-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="glass-card-hover p-4 text-left text-xs sm:text-sm text-slate-200 hover:text-white
                             border border-white/10 hover:border-cyan-500/40 rounded-2xl
                             transition-all duration-300 group flex items-start gap-3 shadow-lg shadow-black/40 hover:scale-[1.02]"
                >
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform font-bold">→</span>
                  <span className="flex-1 leading-snug">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg}
            isUser={msg.isUser}
          />
        ))}

        {isLoading && <ChatMessage isTyping />}

        <div ref={messagesEndRef} />
      </div>

      {/* Glass input bar area */}
      <div className="px-4 lg:px-8 py-4 border-t border-white/10 bg-[#0a0f1d]/85 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              id="chat-input"
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.placeholder')}
              rows={1}
              className="input-field resize-none min-h-[52px] max-h-[140px] pr-12 text-sm"
              style={{ height: 'auto' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
              }}
            />
          </div>
          <button
            id="send-button"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="btn-primary flex-shrink-0 w-13 h-13 rounded-2xl flex items-center justify-center
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            <HiOutlinePaperAirplane className="w-5 h-5 -rotate-45" />
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-slate-400 mt-2.5 max-w-4xl mx-auto font-medium">
          {t('app.disclaimer')}
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
