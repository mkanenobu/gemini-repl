import type { REPLEval } from "node:repl";
import type { Config } from "./config.ts";
import { createChatStream } from "./gemini.ts";
import type { REPLContext } from "./repl-context.ts";
import { createSystemMessage, createUserMessage } from "./message.ts";
import { newSpinner } from "./spinner.ts";

export const createEvaluator = (config: Config, ctx: REPLContext): REPLEval => {
  return async function (input, replCtx, file, cb) {
    const input_ = input.trim();
    if (input_ === "") {
      return this.displayPrompt();
    }

    const spinner = newSpinner().start();

    try {
      const chat = await createChatStream({
        model: config.model,
        apiKey: config.apiKey,
        messages: ctx.messages,
        systemInstruction: config.systemContext,
      });

      const response = await chat.ask(input_, {
        stream: (s) => {
          spinner.isSpinning && spinner.stop();
          process.stdout.write(s);
        },
      });
      process.stdout.write("\n");

      ctx.messages.push(createUserMessage(input_));
      ctx.messages.push(createSystemMessage(response));

      spinner.stop();
      return this.displayPrompt();
    } catch (error) {
      spinner.stop();
      return cb(error as Error, { input: input_ });
    }
  };
};
