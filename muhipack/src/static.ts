import fs from "node:fs/promises";
import path from "node:path";
import MuhipackError from "./common/errors.ts";
import type { IStaticFilesReturnType } from "muhipack";
async function prepareStaticFile(
  url: string,
  staticDir: string,
): Promise<IStaticFilesReturnType> {
  let baseResource = path.join(process.cwd(), staticDir);
  let stat = await fs.lstat(baseResource);
  if (!stat.isDirectory()) {
    throw new MuhipackError("ERMISSINGDIR");
  }
  let paths: string[] = [baseResource, url];
  // if we need separate another files alongside index.html
  // but need to add another configuration in muhi.config.js
  // paths [{path :"/", body : "index.html"}, {path:"/about", body: "about.html"}]
  // and iterate them into this code below
  // tried to do '/about' but it will redirect onto 404 not found
  // only work with extetsion name 'about.html'
  if (url.endsWith("/")) {
    paths.push("/index.html");
  }
  const filePath: string = path.join(...paths);
  const fileFound: boolean = await fs
    .access(filePath)
    .then(() => true)
    .catch(() => false);
  const file: string = fileFound ? filePath : baseResource + "/404.html";
  const fileExtension: string = path.extname(file).substring(1).toLowerCase();
  let responseBody = await fs.readFile(file);

  return {
    found: fileFound,
    body: responseBody,
    extname: fileExtension,
  };
}

export default prepareStaticFile;
