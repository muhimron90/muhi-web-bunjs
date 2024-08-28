import { serve, type Server } from "bun";
import { Logger } from "./common/logger.ts";
import { injectLiveReload } from "./hotreload.ts";
import requestHandler from "./requestHandler.ts";
import type { IUserConfig } from "muhipack";

async function createServer(options: IUserConfig): Promise<Server | undefined> {
  const { entryfiles, staticDirectory, host, port, devMode } = options;
  const logger = new Logger("server", devMode);
  return serve<Server>(
    await injectLiveReload(
      {
        hostname: <string>host || "0.0.0.0",
        port: <number>port || 3000,
        development: <boolean>devMode || true,
        fetch: requestHandler({ devMode: <boolean>devMode, staticDirectory }),
        websocket: {
          message() {},
          close() {
            logger.info("close websocket");
          },
        },
      },
      {
        websocketLiveReloadPrefix: "__muhipack_live_reload__",
        buildConfig: {
          entryfiles,
          devMode: <boolean>devMode,
          outDir: staticDirectory,
        },
        watchDirPath: "src",
      },
    ),
  );
}
export default createServer;
