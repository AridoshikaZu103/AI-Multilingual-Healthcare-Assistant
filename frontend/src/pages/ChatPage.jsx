import { useState, useCallback } from 'react';
import ChatWindow from '../components/ChatWindow';
import { sendChatMessage } from '../services/api';

function ChatPage({ t, language }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const handleSendMessage = useCallback(async (text) => {
    // Add user message
    const userMsg = {
      text,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(text, language, sessionId);

      // Store session ID for conversation continuity
      if (response.session_id && !sessionId) {
        setSessionId(response.session_id);
      }

      // Add bot response
      const botMsg = {
        text: response.reply,
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);

      // Add error message
      const errorMsg = {
        text: t('common.error'),
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [language, sessionId, t]);

  return (
    <div className="h-full">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        t={t}
      />
    </div>
  );
}

export default ChatPage;
