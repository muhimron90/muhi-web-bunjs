import { type IBuildFilesParams } from "muhipack";
import { watch } from "node:fs";
import path from "node:path";
import { Logger } from "./common/logger.ts";
import buildFiles from "./build.ts";
import {
  type Serve,
  type Server,
  type WebSocketHandler,
  type WebSocketServeOptions,
} from "bun";
import normalizeErrorMessage from "./utils/normalizeErrorMessage.ts";
import MuhipackError from "./common/errors.ts";
import { HttpStatus } from "./common/httpStatusCode.ts";

function generateScript(wsPrefix: string) {
  const templateScript = `
    <!-- Injected by MuhiServer -->
    <script type="text/javascript">
      // <![CDATA [ <-- SVG
      if ("WebSocket" in window) {
        (function () {
          var isDev = window.location.hostname === "localhost";
          if (isDev) {
            var protocol = window.location.protocol === "http:" ? "ws://" : "wss//";
            var address =
              protocol +
              window.location.host +
              window.location.pathname +
              "${wsPrefix}";
            console.log(address);
            var socket = new WebSocket(address);
            socket.onopen = function () {
                console.log("Live reload enabled");
            };
            socket.onmessage = function (msg) {
              if (msg.data === "reload") {
                console.log("reload");
                window.location.reload();
              }
            };
            socket.onclose = function () {
                console.log("close live reload connection");
            };
          }
        })();
      }
      //]]>
    </script>
`;

  return templateScript;
}
type TServerOptions<T extends unknown> = Omit<
  WebSocketServeOptions<T>,
  "fetch" | "websocket"
> & {
  fetch(
    request: Request,
    server: Server,
  ): Promise<Response | undefined> | Response | undefined;
  websocket: WebSocketHandler<T>;
};
interface ILiveReloadConfig {
  buildConfig: IBuildFilesParams;
  websocketLiveReloadPrefix?: string;
  watchDirPath?: string;
}
export function injectLiveReload<T, O extends TServerOptions<T>>(
  options: O,
  userConfig: ILiveReloadConfig,
): Serve<T> | Promise<Serve<T>> {
  const { websocketLiveReloadPrefix, buildConfig, watchDirPath } = userConfig;

  const logger = new Logger("HMR");
  if (!buildConfig.devMode) {
    return options;
  }
  const watchPath = path.join(process.cwd(), watchDirPath as string);
  if (!watchPath || typeof watchPath === "undefined") {
    throw new MuhipackError("ERMISSINGDIR");
  }

  let watcher = watch(watchPath, { recursive: true });
  return {
    ...options,
    async fetch(request, server) {
      const url = new URL(request.url);
      const urlWsPathname = "/" + websocketLiveReloadPrefix;
      if (url.pathname === urlWsPathname) {
        const upgrade = server.upgrade(request);
        if (!upgrade) {
          const messageBody = "Failed to Upgrade server";
          return new Response(messageBody, {
            status: HttpStatus.BadRequest,
            headers: {
              "Content-Type": "text/plain",
              "Content-Length": `${Buffer.byteLength(messageBody)}`,
            },
          });
        }
        return;
      }
      const response = await options.fetch(request, server);
      if (!response?.headers.get("Content-Type")?.startsWith("text/html")) {
        return response;
      }
      try {
        let responseBody = await response!.text();
        const injectedScriptToBody = responseBody.replace(
          "</body>",
          generateScript(<string>websocketLiveReloadPrefix),
        );
        responseBody = <string>injectedScriptToBody;
        return new Response(responseBody, {
          status: <number>response?.status,
          headers: {
            "Content-Type": <string>response?.headers.get("Content-Type"),
            "Content-Length": <string>`${Buffer.byteLength(responseBody)}`,
          },
        });
      } catch (error) {
        logger.error(normalizeErrorMessage(error));
        return response;
      }
    },
    websocket: {
      ...options.websocket,
      open(ws) {
        logger.info("Hot Reload is Running");
        let previousTime = new Date().valueOf();
        watcher.on("change", async (_, filename) => {
          const timeNow = Date.now();
          if (filename) {
            if (timeNow === previousTime) {
              return;
            }
            await buildFiles(buildConfig);
            ws.send("reload");
            logger.info("reloaded");
            previousTime = timeNow;
          }
        });
        watcher.once("error", () => {
          logger.info("Watcher Error");
          watcher.close();
        });
        watcher.on("close", () => {
          watcher.removeAllListeners();
          ws.close();
        });
      },
    },
  };
}
