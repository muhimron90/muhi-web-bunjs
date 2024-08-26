import { Logger } from "./src/common/logger.ts";
import loadConfig from "./src/config/load.ts";
import createServer from "./src/server.ts";
import normalizeErrorMessage from "./src/utils/normalizeErrorMessage.ts";
import MuhipackError from "./src/common/errors.ts";
const logger = new Logger("cli", true); //set false to disable colorize
(async () => {
  try {
    const userDefineConfig = await loadConfig("muhi.config.js");
    const server = await createServer(userDefineConfig);
    if (!server || typeof server === "undefined") {
      throw new MuhipackError("FAILURE");
    }
    logger.info(`server run on ${server.hostname}:${server.port}`);
    process.on("SIGTERM", () => {
      // close watcher when Ctrl-C is pressed
      console.log("Closing Server");
      server.unref();
      server.stop();
      process.exit(0);
    });
    process.on("SIGINT", () => {
      // close watcher when Ctrl-C is pressed
      console.log("Closing Server");
      server.unref();
      server.stop();
      process.exit(0);
    });
  } catch (error) {
    // console.error(error);
    logger.error(normalizeErrorMessage(error));
    process.exit(1);
  }
})();
