import type { IUserConfig } from "muhipack";

function isStaticDirExists(config: IUserConfig): config is IUserConfig {
  return config && "staticDirectory" in config;
}

function isEntryFileExists(config: IUserConfig): config is IUserConfig {
  return config && "entryfiles" in config;
}

/**
 * @param {IUserConfig} config - userConfig
 * @returns {IUserConfig}
 */
function defineConfig(config: IUserConfig): IUserConfig {
  if (!isStaticDirExists(config)) {
    throw new Error("static directory is not exists");
  }
  if (!isEntryFileExists(config)) {
    throw new Error("please provide your Entryfiles");
  }
  return config;
}
export default defineConfig;
