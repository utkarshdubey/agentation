import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    content: "src/content.ts",
    background: "src/background.ts",
    popup: "src/popup.ts",
  },
  format: ["esm"],
  outDir: "dist",
  sourcemap: true,
  clean: true,
  minify: false,
  target: "es2020",
});
