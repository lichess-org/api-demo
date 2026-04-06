import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import scss from "rollup-plugin-scss";
import sass from "sass";
import terser from "@rollup/plugin-terser";
import path from "node:path";
import fs from "node:fs";

function chessgroundReal3dFallback() {
  return {
    name: "chessground-real3d-fallback",
    resolveId(source, importer) {
      if (
        source === "./real3d/scene.js" &&
        importer &&
        importer.includes("@lichess-org/chessground/dist/chessground.js")
      ) {
        const resolved = path.resolve(path.dirname(importer), "real3d/scene.js");
        if (fs.existsSync(resolved)) return resolved;
      }
      return null;
    },
  };
}

export default (args) => ({
  input: "src/main.ts",
  output: {
    file: args["config-prod"] ? "dist/index.min.js" : "index.js",
    format: "iife",
    name: "LichessDemo",
    plugins: args["config-prod"]
      ? [
          terser({
            safari10: false,
            output: { comments: false },
          }),
        ]
      : [],
  },
  plugins: [
    chessgroundReal3dFallback(),
    resolve(),
    typescript(),
    commonjs(),
    scss({
      include: ["scss/*"],
      output: args["config-prod"] ? "./dist/style.min.css" : "./style.css",
      runtime: sass,
      ...(args["config-prod"] ? { outputStyle: "compressed" } : {}),
    }),
  ],
});
