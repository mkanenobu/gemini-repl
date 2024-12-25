import Gemini, { type Message } from "gemini-ai";

let geminiClient: Gemini;
const init = (apiKey: string): Gemini => {
  if (geminiClient) return geminiClient;

  geminiClient = new Gemini(apiKey);
  return geminiClient;
};

export const createChatStream = async ({
  apiKey,
  model,
  messages,
  systemInstruction,
}: {
  apiKey: string;
  model: string;
  messages: Array<Message>;
  systemInstruction?: string;
}) => {
  const client = init(apiKey);
  return client.createChat({
    model,
    messages,
    systemInstruction,
  });
};
