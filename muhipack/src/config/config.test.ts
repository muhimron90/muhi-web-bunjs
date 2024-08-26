import { expect, beforeEach, describe, it } from "bun:test";
import loadConfig from "./load.ts";
let config = {};
beforeEach(async () => {
  config = await loadConfig("muhi.config.js");
});

describe("Muhipack Config ", () => {
  it("should be an object and have properties defined", () => {
    expect(config).toBeObject();
    expect(config).toMatchObject({
      staticDirectory: "www",
      port: 3000,
      host: "127.0.0.1",
      devMode: true,
    });
  });
});
