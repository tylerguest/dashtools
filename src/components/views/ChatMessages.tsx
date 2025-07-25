import React from 'react';
import { chatbotViewClassNames } from '../../styles/classNames';
import { Message } from '../../hooks/useChatbot';

interface ChatMessagesProps {
  messages: Message[];
  loadingMsg: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, loadingMsg, messagesEndRef }) => (
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
);

export default ChatMessages;
