import React from 'react';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-md p-4 rounded-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
      {content}
    </div>
  </div>
);

export default ChatMessage;