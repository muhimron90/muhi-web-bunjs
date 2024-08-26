import type { IKeyMimeTypes, IMimeTypes } from "muhipack";

const MIME_TYPES: Record<string, IMimeTypes[IKeyMimeTypes]> = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
} as const;
export default MIME_TYPES;
