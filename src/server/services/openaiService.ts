import { OpenAI } from 'openai';
import WebSocket from 'ws';
import { logger } from '../utils/logger';

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

const openai = new OpenAI({ baseURL: endpoint, apiKey: token });

export async function processStreamingChat(content: string, ws: WebSocket) {
  try {
    const stream = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content }
      ],
      model: modelName,
      stream: true
    });

    for await (const part of stream) {
      const content = part.choices[0]?.delta?.content || '';
      if (content) {
        ws.send(JSON.stringify({ type: 'content', content }));
      }
    }
    ws.send(JSON.stringify({ type: 'done' }));
  } catch (error) {
    logger.error('Error in OpenAI service:', error);
    ws.send(JSON.stringify({ type: 'error', message: 'An error occurred in the AI service' }));
  }
}