import ora, { type Ora } from "ora";
import cliSpinners from "cli-spinners";

export const newSpinner = (): Ora => {
  const spinner = ora({
    spinner: cliSpinners.dots,
    discardStdin: false,
  });
  return spinner;
};
