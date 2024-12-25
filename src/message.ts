import type { Content } from "@google/generative-ai";

export const createModelMessage = (content: string): Content => {
  return {
    role: "model",
    parts: [{ text: content }],
  };
};

export const createUserMessage = (content: string): Content => {
  return {
    role: "user",
    parts: [{ text: content }],
  };
};
