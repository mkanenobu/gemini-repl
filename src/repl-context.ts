import type { Message } from "gemini-ai";

export type REPLContext = {
  systemMessage?: string;
  messages: Array<Message>;
};
