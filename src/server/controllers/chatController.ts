import { Request, Response } from 'express';
import WebSocket from 'ws';
import { processStreamingChat } from '../services/openaiService';
import { logger } from '../utils/logger';

export function handleChat(req: Request, res: Response) {
  const { message } = req.body;
  // Handle non-streaming chat requests here
  res.json({ message: "Chat endpoint reached" });
}

export function setupWebSocket(wss: WebSocket.Server) {
  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', async (message: string) => {
      try {
        const { content } = JSON.parse(message);
        await processStreamingChat(content, ws);
      } catch (error) {
        logger.error('Error in WebSocket message handling:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'An error occurred' }));
      }
    });
  });
}