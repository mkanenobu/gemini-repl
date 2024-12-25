import type { REPLEval } from "node:repl";
import type { Config } from "./config.ts";
import { createChatStream } from "./gemini.ts";
import type { REPLContext } from "./repl-context.ts";
import { createModelMessage, createUserMessage } from "./message.ts";
import { newSpinner } from "./spinner.ts";
import { runes } from "runes2";
import { setTimeout } from "node:timers/promises";

export const createEvaluator = (config: Config, ctx: REPLContext): REPLEval => {
  return async function (input, _replCtx, _file, cb) {
    const input_ = input.trim();
    if (input_ === "") {
      return this.displayPrompt();
    }

    ctx.contents.push(createUserMessage(input_));
    const spinner = newSpinner().start();

    try {
      const stream = await createChatStream({
        model: config.model,
        apiKey: config.apiKey,
        contents: ctx.contents,
        systemInstruction: config.systemContext,
      });

      let responseBuf = "";
      for await (const chunk of smoothCharGenerator(stream.stream, 5)) {
        if (chunk) {
          // Stop spinner after first response
          spinner.isSpinning && spinner.stop();

          responseBuf += chunk;
          process.stdout.write(chunk);
        }
      }

      ctx.contents.push(createModelMessage(responseBuf));

      spinner.stop();
      return this.displayPrompt();
    } catch (error) {
      spinner.stop();
      return cb(error as Error, { input: input_ });
    }
  };
};

async function* smoothCharGenerator(
  input: Awaited<ReturnType<typeof createChatStream>>["stream"],
  delay = 5,
) {
  for await (const chunk of input) {
    const chunkContent =
      chunk.candidates?.at(0)?.content.parts.at(0)?.text || "";
    for (const rune of runes(chunkContent)) {
      yield rune;
      await setTimeout(delay);
    }
  }
}
