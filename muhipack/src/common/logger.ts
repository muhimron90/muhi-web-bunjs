import { Console } from "node:console";
import calculateTimeLog from "../utils/calculateTimeLog.ts";
enum LEVEL_lOG {
  INFO = "info",
  ERROR = "error",
  DEBUG = "debug",
  WARN = "warn",
  LOG = "log",
}
class Logger {
  private console: Console;
  private name: string;
  private colorize: boolean;
  constructor(name: string, enableColor: boolean = false) {
    this.console = new Console({
      stdout: process.stdout,
      stderr: process.stderr,
    });
    this.name = name;
    this.colorize = enableColor;
  }
  private getLocalDateTime(): string {
    const timeNow = Date.now();
    const dateTime = new Date(timeNow);
    const timeFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(
      undefined,
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      },
    );

    const time = timeFormatter.format(dateTime).split(",");
    let result: string = "";
    for (let i = 0; i < time.length; ++i) {
      result += time[i];
    }
    return result;
  }
  private format(level: LEVEL_lOG, message: string, timeLog: number): string {
    /* ANSI COLOR
     * https://talyian.github.io/ansicolors/
     */
    let timestamp = this.colorize
      ? `\x1b[33m${this.getLocalDateTime()}\x1b[0m`
      : this.getLocalDateTime();

    const prefixName = this.colorize
      ? `\x1b[35m[${this.name}]\x1b[0m`
      : `[${this.name}]`;
    const colorizeLevelPrefix =
      level === LEVEL_lOG.ERROR
        ? `\x1b[31m${level}\x1b[0m`
        : `\x1b[32m${level}\x1b[0m`;
    const prefixLevel = this.colorize ? colorizeLevelPrefix : level;

    let logFormatted = timestamp + " " + prefixName + "::";
    logFormatted +=
      prefixLevel + " " + message + " " + calculateTimeLog(timeLog);
    return logFormatted;
  }
  private output(level: LEVEL_lOG, message: string): string | undefined {
    const start = Date.now();
    const output = this.format(level, message, start);
    return output;
  }
  info(message: string) {
    this.console.info(this.output(LEVEL_lOG.INFO, message));
  }
  error(message: string) {
    this.console.error(this.output(LEVEL_lOG.ERROR, message));
  }

  debug(message: string) {
    this.console.debug(this.output(LEVEL_lOG.DEBUG, message));
  }
  warn(message: string) {
    this.console.warn(this.output(LEVEL_lOG.WARN, message));
  }
  log(message: string) {
    this.console.log("%s", this.output(LEVEL_lOG.LOG, message));
  }
}
export { Logger, LEVEL_lOG };
