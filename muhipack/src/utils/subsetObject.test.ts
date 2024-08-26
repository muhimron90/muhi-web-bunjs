import { expect, beforeEach, describe, it } from "bun:test";
import { omitPropConfig, pickPropConfig } from "./subsetObject.ts";

import loadConfig from "../config/load.ts";
import type { IUserConfig } from "muhipack";

let config = {} as IUserConfig;
beforeEach(async () => {
  config = await loadConfig("muhi.config.js");
});
describe("Pick Property from Config", () => {
  it("should get one atleast", () => {
    const result = pickPropConfig(config, "staticDirectory", "port");
    expect(result).toBeObject();
    expect(result).toEqual({ port: 3000, staticDirectory: "www" });
    expect(result).toContainKey("staticDirectory");
    expect(result).toContainKey("port");
  });
});

describe("Omit Property from Config", () => {
  it("should not to equal with defined key", () => {
    const result = omitPropConfig(config, "port");
    expect(result).toBeObject();
    expect(result).toContainKey("host");
    expect(result).not.toEqual("port");
  });
});
