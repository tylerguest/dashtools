import React from 'react';
import { chatbotViewClassNames, buttonClassNames } from '../../../styles/classNames';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  loadingMsg: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSend, handleKeyDown, loadingMsg }) => (
  <div className={chatbotViewClassNames.inputRow}>
    <input
      className={chatbotViewClassNames.input}
      type="text"
      value={input}
      onChange={e => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type your message..."
      disabled={loadingMsg}
    />
    <button
      className={`${buttonClassNames.base} ${buttonClassNames.primary} ${buttonClassNames.sizes.md}`}
      onClick={handleSend}
      type="button"
      aria-label="Send"
      disabled={loadingMsg}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
      </svg>
    </button>
  </div>
);

export default ChatInput;
