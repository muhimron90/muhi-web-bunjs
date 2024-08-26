import { serve, type Server } from "bun";
import { HttpStatus, reasonPhrase } from "./common/httpStatusCode.ts";
import prepareStaticFile from "./static.ts";
import MIME_TYPES from "./mime.ts";
import { Logger } from "./common/logger.ts";
import calculateTimeLog from "./utils/calculateTimeLog.ts";
import { type IUserConfig } from "muhipack";
import { injectLiveReload } from "./hotreload.ts";
import buildFiles from "./build.ts";
async function createServer(options: IUserConfig): Promise<Server | undefined> {
  const { entryfiles, staticDirectory, host, port, devMode } = options;
  const logger = new Logger("server", devMode);
  await buildFiles({
    entryfiles,
    devMode: <boolean>devMode,
    outDir: staticDirectory,
  });
  return serve<Server>(
    await injectLiveReload(
      {
        hostname: <string>host || "0.0.0.0",
        port: <number>port || 3000,
        development: <boolean>devMode || true,
        async fetch(request, server) {
          const start = Date.now();
          if (request.method !== "GET" && request.method !== "HEAD") {
            const message = `${reasonPhrase(HttpStatus.MethodNotAllowed)} ${request.method}`;
            return new Response(message, {
              status: HttpStatus.MethodNotAllowed,
              headers: {
                "Content-Type": "text/plain",
                "Content-Length": `${Buffer.byteLength(message)}`,
              },
            });
          }
          const url = new URL(request.url);
          if (server.upgrade(request)) return;
          const { found, extname, body } = await prepareStaticFile(
            url.pathname,
            staticDirectory,
          );
          let responseBody = body;
          let statusCode = found ? HttpStatus.Ok : HttpStatus.NotFound;
          logger.log(
            `${request.method}::${url.pathname} ${statusCode} - ${calculateTimeLog(start)}`,
          );
          return new Response(responseBody, {
            status: statusCode,
            headers: {
              "Content-Type": MIME_TYPES[extname] || MIME_TYPES["default"],
              "Content-Length": `${Buffer.byteLength(responseBody)}`,
            },
          });
        },
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
