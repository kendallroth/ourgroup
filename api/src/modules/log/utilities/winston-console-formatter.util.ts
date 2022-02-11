import chalk from "chalk";
import dayjs from "dayjs";
import { format } from "winston";
const { printf } = format;

/** Match a log level to a terminal color */
const getColorFromLogLevel = (logLevel: string): chalk.ChalkFunction => {
  switch (logLevel) {
    case "error":
      return chalk.red;
    case "info":
    case "log":
      return chalk.green;
    case "warn":
      return chalk.yellow;
    default:
      return chalk.reset;
  }
};

/**
 * Custom formatter for Winston console transport
 *
 * Source: https://github.com/winstonjs/logform#printf
 */
const winstonConsoleFormatter = printf(({ context, error, level, message, timestamp }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isObject = (obj: any) =>
    typeof obj !== "undefined" && obj !== null && typeof obj === "object";
  const color = getColorFromLogLevel(level);

  // TODO: Determine if this is the best approach to displaying object data
  const output = isObject(message)
    ? `${color("Object:")}\n${JSON.stringify(message, null, 2)}`
    : color(message as string);

  const prefix = color("[Nest]");
  const contextMessage = context ? chalk.yellow(`[${context}] `) : "";
  const timeMessage = dayjs(timestamp).format("YYYY/MM/DD HH:mm:ss");
  const logLevelMessage = color(level.toUpperCase().padStart(7, " "));
  const errorMessage = error ? `\n${error.stack ?? error}` : "";
  return `${prefix} ${timeMessage} ${logLevelMessage} ${contextMessage}${output}${errorMessage}`;
});

export { winstonConsoleFormatter };
