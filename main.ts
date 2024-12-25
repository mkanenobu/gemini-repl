import { startRepl } from "./src/repl.ts";
import { loadConfig } from "./src/config.ts";

const main = async () => {
  const config = await loadConfig();
  await startRepl({ config });
};

main();
