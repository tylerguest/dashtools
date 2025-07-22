import React, { useState, useRef, useEffect } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const initialMessages: Message[] = [
  { sender: 'bot', text: 'Hello! I am your AI assistant. How can I help you today?' },
];

function getMockLLMResponse(input: string): string {
  if (input.toLowerCase().includes('hello')) return 'Hi there! How can I assist you?';
  if (input.toLowerCase().includes('price')) return 'The current price is $123.45.';
  return "I'm here to help!";
}

export default function ChatbotView() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setTimeout(() => {
      const botMsg: Message = { sender: 'bot', text: getMockLLMResponse(input) };
      setMessages((msgs) => [...msgs, botMsg]);
    }, 600);
    setInput('');
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
