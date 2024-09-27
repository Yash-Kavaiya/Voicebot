import { useState, useCallback, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

const WS_URL = 'ws://localhost:3000';

export default function useChat() {
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleSendMessage = useCallback((message: string) => {
    sendMessage(message);
  }, [sendMessage]);

  return { sendMessage: handleSendMessage, lastMessage, readyState, messageHistory };
}