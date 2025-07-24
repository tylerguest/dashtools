import React, { useState, useRef, useEffect } from 'react';
import { chatbotViewClassNames, buttonClassNames } from '../../styles/classNames';

interface Message { sender: 'user' | 'bot'; text: string; }

const initialMessages: Message[] = [
  { sender: 'bot', text: 'Hello! I am your AI assistant. How can I help you today?' },
];

async function fetchLLMResponse(input: string): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input }),
    });
    if (!res.ok) {
      return 'Sorry, there was an error contacting the AI.';
    }
    const data = await res.json();
    return data.response || 'Sorry, no response from the AI.';
  } catch {
    return 'Sorry, there was a network error.';
  }
}

export default function ChatbotView() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [loadingMsg, setLoadingMsg] = useState(false);
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoadingMsg(true);
    setInput('');
    const botText = await fetchLLMResponse(input);
    setMessages((msgs) => [...msgs, { sender: 'bot', text: botText }]);
    setLoadingMsg(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className={chatbotViewClassNames.container}>
      <div className={chatbotViewClassNames.chatArea}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              chatbotViewClassNames.messageRowBase +
              (msg.sender === 'user'
                ? ' ' + chatbotViewClassNames.userMessageRow
                : ' ' + chatbotViewClassNames.botMessageRow)
            }
          >
            <div
              className={
                chatbotViewClassNames.messageBubbleBase +
                (msg.sender === 'user'
                  ? ' ' + chatbotViewClassNames.userMessageBubble
                  : ' ' + chatbotViewClassNames.botMessageBubble)
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loadingMsg && (
          <div className={chatbotViewClassNames.loadingRow}>
            <div className={chatbotViewClassNames.loadingBubble}>Thinking…</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={chatbotViewClassNames.inputRow}>
        <input
          className={chatbotViewClassNames.input}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button
          className={`${buttonClassNames.base} ${buttonClassNames.primary} ${buttonClassNames.sizes.md}`}
          onClick={handleSend}
          type="button"
          aria-label="Send"
        >
          {/* Paper plane send icon (inline SVG) */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
