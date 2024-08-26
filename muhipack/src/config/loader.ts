import { pathToFileURL } from "bun";

async function loadJs<T extends unknown>(file: string): Promise<T | null> {
  const configJs = await import(pathToFileURL(file).href)
    .then((mod) => mod.default)
    .catch(() => {
      return null;
    });
  return configJs;
}
export default loadJs;
