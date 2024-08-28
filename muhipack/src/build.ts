import { build } from "bun";
import path from "node:path";
import { Logger } from "./common/logger.ts";
import type { IBuildFilesParams } from "muhipack";

async function buildFiles({
  entryfiles,
  devMode,
  outDir,
}: IBuildFilesParams): Promise<void> {
  const logger = new Logger("build", devMode);
  let files: string[] = [];
  if (files.length == 0) {
    for (let i = 0; i < entryfiles.length; ++i) {
      files.push(path.join(process.cwd(), entryfiles[i]));
    }
  }
  await build({
    entrypoints: files,
    outdir: outDir,
    format: "esm",
    target: "browser",
    minify: devMode === true ? false : true,
  }).then((log) => {
    log.outputs.forEach((x) => {
      const sizee = x.size < 1000 ? `${x.size} Bytes` : `${x.size / 1000} Kb`;
      const loggs = `BUILD::\tsize: ${sizee}`;
      logger.info(loggs);
    });
  });
}
export default buildFiles;
