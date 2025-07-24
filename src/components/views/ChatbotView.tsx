import React, { useState, useRef, useEffect } from 'react';

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
    <div className="w-full h-full flex flex-col bg-zinc-900 text-zinc-200 font-mono text-sm p-2">
      <div className="flex-1 overflow-y-auto rounded bg-zinc-800 p-2 mb-2">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-zinc-200'}`}>{msg.text}</div>
          </div>
        ))}
        {loadingMsg && (
          <div className="mb-2 flex justify-start">
            <div className="max-w-[70%] px-3 py-2 rounded-lg bg-zinc-700 text-zinc-400 italic animate-pulse">Thinking…</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded bg-zinc-800 px-3 py-2 outline-none border border-zinc-700 focus:border-blue-500"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded font-bold"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
