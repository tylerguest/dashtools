import { useState, useRef, useEffect } from 'react';

export interface Message {
  sender: 'user' | 'bot';
  text: string;
}

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
    let response = data.response;
    if (typeof response !== 'string') {
      response = JSON.stringify(response);
    }
    return response || 'Sorry, no response from the AI.';
  } catch {
    return 'Sorry, there was a network error.';
  }
}

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loadingMsg, setLoadingMsg] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  return {
    messages,
    setMessages,
    input,
    setInput,
    loadingMsg,
    handleSend,
    handleKeyDown,
    messagesEndRef,
  };
}
