import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import VoiceRecorder from './VoiceRecorder';
import FileUploader from './FileUploader';
import useWebSocket from '../hooks/useWebSocket';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Array<{content: string, isUser: boolean}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { sendMessage, lastMessage, readyState } = useWebSocket();

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      if (data.type === 'content') {
        setMessages(prevMessages => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (!lastMessage || lastMessage.isUser) {
            return [...prevMessages, { content: data.content, isUser: false }];
          } else {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1].content += data.content;
            return updatedMessages;
          }
        });
      }
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && readyState === WebSocket.OPEN) {
      sendMessage(JSON.stringify({ content: inputMessage }));
      setMessages(prevMessages => [...prevMessages, { content: inputMessage, isUser: true }]);
      setInputMessage('');
    }
  };

  const handleVoiceTranscription = (transcription: string) => {
    if (readyState === WebSocket.OPEN) {
      sendMessage(JSON.stringify({ content: transcription }));
      setMessages(prevMessages => [...prevMessages, { content: transcription, isUser: true }]);
    }
  };

  const handleFileUpload = (transcription: string) => {
    if (readyState === WebSocket.OPEN) {
      sendMessage(JSON.stringify({ content: transcription }));
      setMessages(prevMessages => [...prevMessages, { content: transcription, isUser: true }]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">AI Chat Assistant</h1>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <ChatMessage key={index} content={message.content} isUser={message.isUser} />
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded-lg"
        />
        <button onClick={handleSendMessage} className="p-2 bg-blue-500 text-white rounded-lg">
          Send
        </button>
        <VoiceRecorder onTranscription={handleVoiceTranscription} />
        <FileUploader onTranscription={handleFileUpload} />
      </div>
    </div>
  );
};

export default App;