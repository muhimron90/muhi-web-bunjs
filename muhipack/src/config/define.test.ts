import { expect, describe, it } from "bun:test";

import defineConfig from "./define.ts";

describe("Define Config", () => {
  it("should have required properties", () => {
    const define = defineConfig({
      entryfiles: ["index.ts"],
      staticDirectory: "www",
      host: "",
      port: 0,
      devMode: true,
    });
    expect(define).not.toBeEmptyObject();
    expect(define).toContainAllKeys([
      "entryfiles",
      "staticDirectory",
      "host",
      "port",
      "devMode",
    ]);
  });
});
