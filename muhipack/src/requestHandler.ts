import type { Server } from "bun";
import { HttpStatus, reasonPhrase } from "./common/httpStatusCode.ts";
import prepareStaticFile from "./static.ts";
import MIME_TYPES from "./mime.ts";
import { Logger } from "./common/logger.ts";
import type { IUserConfig } from "muhipack";
function requestHandler({
  devMode,
  staticDirectory,
}: Pick<IUserConfig, "devMode" | "staticDirectory">) {
  const logger = new Logger("request", devMode);
  return async (
    request: Request,
    server: Server,
  ): Promise<Response | undefined> => {
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
    logger.log(`${request.method}::${url.pathname} ${statusCode}`);
    return new Response(responseBody, {
      status: statusCode,
      headers: {
        "Content-Type": MIME_TYPES[extname] || MIME_TYPES["default"],
        "Content-Length": `${Buffer.byteLength(responseBody)}`,
      },
    });
  };
}
export default requestHandler;
