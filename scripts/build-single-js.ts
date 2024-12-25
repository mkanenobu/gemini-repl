import { build } from "esbuild";
import { chmod } from "node:fs/promises";

const main = async () => {
  const outfile = "out/gemini-repl.js";

  const result = await build({
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile,
    entryPoints: ["main.ts"],
    banner: {
      js: "#!/usr/bin/env node --no-warnings=ExperimentalWarning",
    },
  });
  console.log(result);

  chmod(outfile, 0o755);
};

await main();
