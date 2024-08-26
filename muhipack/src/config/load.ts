import { file } from "bun";
import loadJs from "./loader.ts";
import { IUserConfig } from "muhipack";

async function isFileExists(str: string): Promise<boolean> {
  return await file(str).exists();
}

async function loadConfig(fileName: string) {
  let found = await isFileExists(fileName);
  if (!found) {
    throw new Error("file config is not found");
  }
  const config = await loadJs(fileName);
  if (!config) {
    throw new Error("cannot get config");
  }
  if (config && typeof config !== "object") {
    throw new TypeError(
      "config is allowed to be an object\n" + `but received ${typeof config}`,
    );
  }
  return config as IUserConfig;
}
export default loadConfig;
