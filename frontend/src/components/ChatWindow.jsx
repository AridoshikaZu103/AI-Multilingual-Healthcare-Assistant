import { useState, useRef, useEffect } from 'react';
import { HiOutlinePaperAirplane, HiOutlineSparkles } from 'react-icons/hi2';
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
    <div className="flex flex-col h-full">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            {/* Welcome hero */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-6 shadow-2xl shadow-primary-500/20">
              <HiOutlineSparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              {t('chat.title')}
            </h2>
            <p className="text-surface-400 text-sm max-w-md mb-8">
              {t('chat.welcome')}
            </p>

            {/* Suggestion chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl w-full">
              {Array.isArray(suggestions) && suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  id={`suggestion-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="glass-card-hover px-4 py-3 text-left text-sm text-surface-300 hover:text-white
                             transition-all duration-200"
                >
                  <span className="text-primary-400 mr-2">→</span>
                  {suggestion}
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

      {/* Input area */}
      <div className="px-4 lg:px-8 py-4 border-t border-surface-800/50 bg-surface-950/80 backdrop-blur-xl">
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
              className="input-field resize-none min-h-[48px] max-h-[120px] pr-12"
              style={{ height: 'auto' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          <button
            id="send-button"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500
                       flex items-center justify-center text-white
                       transition-all duration-300 hover:from-primary-500 hover:to-primary-400
                       hover:shadow-lg hover:shadow-primary-500/25 active:scale-95
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            <HiOutlinePaperAirplane className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-surface-600 mt-2 max-w-4xl mx-auto">
          {t('app.disclaimer')}
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
