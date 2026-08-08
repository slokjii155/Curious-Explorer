import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "web",
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "web/index.html"),
        explorer: resolve(process.cwd(), "web/explorer.html")
      }
    }
  }
});