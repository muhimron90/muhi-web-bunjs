import { defineConfig } from "./muhipack";

const options = {
  entryfiles: ["./src/index.ts"],
  staticDirectory: "www",
  port: 3000,
  host: "127.0.0.1",
  devMode: true,
  /* not implemented yet*/
  //routes: []
};

export default defineConfig(options);
