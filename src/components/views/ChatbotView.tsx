import React from 'react';
import { chatbotViewClassNames } from '../../styles/classNames';
import { useChatbot } from '../../hooks/useChatbot';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function ChatbotView() {
  const {
    messages,
    setMessages,
    input,
    setInput,
    loadingMsg,
    handleSend,
    handleKeyDown,
    messagesEndRef,
  } = useChatbot();

  return (
    <div className={chatbotViewClassNames.container}>
      <ChatMessages messages={messages} loadingMsg={loadingMsg} messagesEndRef={messagesEndRef} />
      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        handleKeyDown={handleKeyDown}
        loadingMsg={loadingMsg}
      />
    </div>
  );
}
