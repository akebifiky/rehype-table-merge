/*
 * Rollup config to build CommonJS module
 */
import { nodeResolve } from "@rollup/plugin-node-resolve";
import rollupCommonJS from "@rollup/plugin-commonjs";
import rollupTypeScript from "rollup-plugin-typescript2";
import { cjsToEsm } from "cjstoesm";

export default {
  input: "src/index.ts",
  output: {
    file: "lib/cjs/index.cjs",
    format: "cjs",
    exports: "auto",
  },
  plugins: [
    nodeResolve(),
    rollupCommonJS(),
    rollupTypeScript({
      tsconfig: "./tsconfig.json",
      transformers: [() => cjsToEsm()],
    }),
  ],
};
