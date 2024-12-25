import type { Message } from "gemini-ai";

export const createSystemMessage = (content: string): Message => {
  return {
    role: "system",
    parts: [{ text: content }],
  };
};

export const createUserMessage = (content: string): Message => {
  return {
    role: "user",
    parts: [{ text: content }],
  };
};

export const createAssistantMessage = (content: string): Message => {
  return {
    role: "model",
    parts: [{ text: content }],
  };
};
