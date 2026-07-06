import { useState, useEffect, useRef } from 'react';
import ChatBubble from '../../components/ai/ChatBubble';
import ChatInput from '../../components/ai/ChatInput';
import api from '../../api/axiosInstance';
import './AIAssistantPage.css';

// ── Suggested prompt chips ────────────────────────────────
const SUGGESTED_PROMPTS = [
  'Check my leave balance',
  'Show latest payslip',
  'My attendance this month',
  'Raise a helpdesk ticket',
  'My performance review',
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 'msg-initial',
      role: 'assistant',
      content: 'Hello! I am your AI assistant. How can I help you today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Determine if this is the initial empty state (only the greeting)
  const isInitialState = messages.length <= 1;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function handleSend(text) {
    // Add user message
    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await api.post('/ai/ask', { query: text });
      const aiResponse = res.data.data;
      
      const assistantMsg = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: "I'm sorry, I encountered an error connecting to the backend. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSuggestion(prompt) {
    handleSend(prompt);
  }

  return (
    <div className="ai-page">
      {/* Header */}
      <div className="ai-page__header">
        <div>
          <h1 className="ai-page__title">
            🤖 AI Assistant
          </h1>
          <p className="ai-page__subtitle">
            Ask me about leaves, payslips, attendance, and more
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="ai-page__messages" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="ai-page__typing">
            <span className="ai-page__typing-avatar">🤖</span>
            <div className="typing-indicator" aria-label="AI is typing">
              <div className="typing-indicator__dot" />
              <div className="typing-indicator__dot" />
              <div className="typing-indicator__dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts — only shown when chat is near-empty */}
      {isInitialState && !isTyping && (
        <div className="ai-page__suggestions" aria-label="Suggested prompts">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              className="ai-suggestion-chip"
              onClick={() => handleSuggestion(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="ai-page__input-area">
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
}
