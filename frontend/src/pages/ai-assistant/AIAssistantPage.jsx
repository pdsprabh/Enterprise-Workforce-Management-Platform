import { useState, useEffect, useRef } from 'react';
import ChatBubble from '../../components/ai/ChatBubble';
import ChatInput from '../../components/ai/ChatInput';
import { mockAIMessages, mockLeaveBalance, mockPayslipHistory, mockAttendanceLog, mockReviews } from '../../utils/mockData';
import { formatCurrency } from '../../utils/formatters';
import './AIAssistantPage.css';

// ── Suggested prompt chips ────────────────────────────────
const SUGGESTED_PROMPTS = [
  'Check my leave balance',
  'Show latest payslip',
  'My attendance this month',
  'Raise a helpdesk ticket',
  'My performance review',
];

// ── Mock AI response generator ────────────────────────────
function getMockResponse(userMessage) {
  const msg = userMessage.toLowerCase();

  if (msg.includes('leave') || msg.includes('balance')) {
    const lines = mockLeaveBalance.map(
      (b) => `**${b.label}:** ${b.total - b.used} remaining (${b.used}/${b.total} used)`
    );
    return `Here's your current leave balance:\n\n${lines.join('\n')}`;
  }

  if (msg.includes('payslip') || msg.includes('salary') || msg.includes('pay')) {
    const latest = mockPayslipHistory[0];
    return `Your latest payslip is for **${latest.month}**:\n\n**Gross:** ${formatCurrency(latest.gross)}\n**Deductions:** ${formatCurrency(latest.deductions)}\n**Net Pay:** ${formatCurrency(latest.net)}\n\nHead to the Payroll section to view or download the full payslip.`;
  }

  if (msg.includes('attendance')) {
    const workdays = mockAttendanceLog.filter((r) => r.status !== 'weekend');
    const present = workdays.filter((r) => r.status === 'present' || r.status === 'late').length;
    const absent = workdays.filter((r) => r.status === 'absent').length;
    const late = workdays.filter((r) => r.status === 'late').length;
    return `Here's your attendance summary for the last 30 days:\n\n**Present:** ${present} days\n**Absent:** ${absent} days\n**Late arrivals:** ${late} days\n\nVisit the Attendance page for the full calendar view.`;
  }

  if (msg.includes('ticket') || msg.includes('helpdesk') || msg.includes('support')) {
    return `To raise a support ticket, head to the **Helpdesk** section and click **"+ Create Ticket"**. You can choose the category (IT, HR, Admin, Facilities) and priority level.\n\nIs there anything else I can help you with?`;
  }

  if (msg.includes('performance') || msg.includes('review') || msg.includes('rating')) {
    const latest = mockReviews.find((r) => r.status === 'completed');
    if (latest) {
      return `Your most recent review is **${latest.cycle}** (${latest.period}):\n\n**Rating:** ${latest.rating}/5 ⭐\n**Reviewer:** ${latest.reviewer}\n\n_"${latest.feedback.slice(0, 120)}..."_\n\nVisit the Performance page to see all review cycles.`;
    }
    return 'No completed reviews found. Your Q3 2026 review is currently in progress.';
  }

  return "I'll connect to the HR system to fetch that for you once the backend is live. In the meantime, you can navigate to the relevant section from the sidebar. Is there anything else I can help you with?";
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState(mockAIMessages);
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

    // Simulate AI thinking delay (800ms – 1.5s)
    const delay = 800 + Math.random() * 700;
    await new Promise((r) => setTimeout(r, delay));

    const aiResponse = getMockResponse(text);
    const assistantMsg = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
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
