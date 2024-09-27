import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import path from 'path';
import { setupRoutes } from './routes/api';
import { setupWebSocket } from './controllers/chatController';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());

setupRoutes(app);
setupWebSocket(wss);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});