import { GoogleGenerativeAI, type Content } from "@google/generative-ai";

let client: GoogleGenerativeAI;
const init = (apiKey: string) => {
  if (client) return client;

  client = new GoogleGenerativeAI(apiKey);
  return client;
};

export const createChatStream = async ({
  apiKey,
  model,
  contents,
  systemInstruction,
}: {
  apiKey: string;
  model: string;
  contents: Array<Content>;
  systemInstruction?: string;
}) => {
  const client = init(apiKey);
  const generativeModel = client.getGenerativeModel({
    model,
  });

  return generativeModel.generateContentStream({
    contents,
    systemInstruction,
  });
};
