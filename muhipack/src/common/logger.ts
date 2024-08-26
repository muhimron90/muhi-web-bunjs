import { Console } from "node:console";
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
  //private cache: Map<number, string>;
  //private cacheSize: number;
  private colorize: boolean;
  constructor(name: string, enableColor: boolean = false) {
    this.console = new Console({
      stdout: process.stdout,
      stderr: process.stderr,
    });
    this.name = name;
    // this.cache = new Map<number, string>();
    // this.cacheSize = 5;
    this.colorize = enableColor;
  }
  // private _setKey(level: LEVEL_lOG): number {
  //   let hashKey = 0;
  //   const len = level.length;
  //   if (len < 0) return hashKey;
  //   for (let i = 0; i < len; ++i) {
  //     let char = level.charCodeAt(i);
  //     hashKey = (hashKey << 2) - hashKey;
  //     hashKey = hashKey + (char % this.cacheSize);
  //   }
  //   return hashKey;
  // }
  private getLocalDateTime(): string {
    const timeNow = Date.now();
    const dateTime = new Date(timeNow);
    let date = ("0" + dateTime.getDate()).slice(-2);
    let month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
    let year = dateTime.getFullYear();
    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    let seconds = dateTime.getSeconds();
    let localTime = year + "-" + month + "-" + date + " ";
    localTime += hours + ":" + minutes + ":" + seconds;
    return localTime;
  }
  private format(level: LEVEL_lOG, message: string): string {
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
    logFormatted += prefixLevel + " " + message;
    return logFormatted;
  }
  private output(level: LEVEL_lOG, message: string): string | undefined {
    // const key = this._setKey(level);
    //
    // if (this.cache.has(key) && this.cache.size >= this.cacheSize) {
    //   this.cache.delete(key);
    // }
    // if (this.cache.has(key)) {
    //   const result = this.cache.get(key) || "";
    //   this.cache.delete(key);
    //   return result;
    // }
    const output = this.format(level, message);
    //this.cache.set(key, output);
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
  // closed() {
  //   this.cache.clear();
  // }
}
export { Logger, LEVEL_lOG };
