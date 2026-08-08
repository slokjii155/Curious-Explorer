import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    root: "web",
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "web/index.html"),
                chemistry: resolve(__dirname, "web/chemistry.html"),
                explorer: resolve(__dirname, "web/explorer.html")
            }
        }
    }
});
