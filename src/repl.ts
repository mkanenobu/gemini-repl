import * as repl from "node:repl";
import { createEvaluator } from "./evaluator.ts";
import { type Config, historyPath } from "./config.ts";
import type { REPLContext } from "./repl-context.ts";

const prompt = "> ";

const getCommands = ({
  context,
  config,
}: {
  context: REPLContext;
  config: Config;
}) => {
  return {
    clear: {
      action() {
        context.contents = [];
        console.log("History cleared");

        this.displayPrompt();
      },
      help: "Clears the chat history",
    },
    messages: {
      action() {
        console.log(
          JSON.stringify(
            [context.systemMessage, ...context.contents].filter((m) => !!m),
            undefined,
            2,
          ),
        );

        this.displayPrompt();
      },
      help: "Prints the chat history",
    },
    config: {
      action() {
        console.log(JSON.stringify(config, undefined, 2));

        this.displayPrompt();
      },
      help: "Prints current configuration",
    },
    "set-model": {
      action(input) {
        config.model = input.trim();
        console.log(`Model set to ${config.model}`);

        this.displayPrompt();
      },
      help: "Set the model",
    },
  } as const satisfies Record<string, repl.REPLCommand>;
};

export const startRepl = async ({ config }: { config: Config }) => {
  const context: REPLContext = {
    contents: [],
    systemMessage: config.systemContext,
  };
  const evaluator = createEvaluator(config, context);

  const r = repl.start({
    prompt,
    eval: evaluator,
  });

  const commands = getCommands({ context, config });

  // define commands
  Object.entries(commands).forEach(([name, cmd]) => {
    r.defineCommand(name, cmd);
  });

  r.setupHistory(historyPath(), (err, _repl) => {
    if (err) {
      console.error("Error setting up history:", err);
    }
  });
  return r;
};
