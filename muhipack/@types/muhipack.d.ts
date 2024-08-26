declare module "muhipack" {
  import type { Server } from "bun";
  interface IRoutes {
    path: string;
    body: unknown;
  }
  interface IUserConfig {
    entryfiles: string[];
    staticDirectory: string;
    port?: number;
    host?: string;
    devMode?: boolean;
    /* not implemented yet, so leave it undefined*/
    /*routes?: IRoutes[];*/
  }
  /** const user config  */
  export const IUserConfig: IUserConfig;

  /** define user config for server  */
  export function defineConfig(config: IUserConfig): IUserConfig;

  /** check if files is existed */
  function isFileExists(str: string): Promise<boolean>;

  interface IStaticFilesReturnType {
    found: boolean;
    body: Buffer;
    extname: string;
  }
  /** prepareing static files */
  async function prepareStaticFile(
    url: string,
    staticDir: string,
  ): Promise<IStaticFilesReturnType>;

  /** html mime types */
  interface IMimeTypes {
    default: string;
    html: string;
    js: string;
    css: string;
    png: string;
    jpg: string;
    gif: string;
    ico: string;
    svg: string;
  }

  type IKeyMimeTypes = keyof IMimeTypes;

  /** create server and http serve */
  async function createServer(options: IUserConfig): Server;

  /** build client files from source root not build or compile muhipack files */
  type IBuildFilesParams = Pick<IUserConfig, "entryfiles" | "devMode"> & {
    outDir: string;
  };
  async function buildFiles({
    entryfiles,
    devMode,
    outDir,
  }: IBuildFilesParams): Promise<void>;

  /** utils */
  /** select one property or properties from object based on user picked */
  function pickPropConfig<O extends unknown, K extends keyof O>(
    obj: O extends object ? O : never,
    ...keys: K[] extends infer U ? U : never
  ): Pick<O, K>;

  /** delete one or some properties which already defined by user */
  function omitPropConfig<O extends unknown, K extends keyof O>(
    obj: O extends object ? O : never,
    ...keys: K[] extends infer U ? U : never
  ): Omit<O, K>;
}
