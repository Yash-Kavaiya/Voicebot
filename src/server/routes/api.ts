import { Express } from 'express';
import { handleChat } from '../controllers/chatController';

export function setupRoutes(app: Express) {
  app.post('/api/chat', handleChat);
}