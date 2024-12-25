import type { Content } from "@google/generative-ai";

export type REPLContext = {
  systemMessage?: string;
  contents: Array<Content>;
};
