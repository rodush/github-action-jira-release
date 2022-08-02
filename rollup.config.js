import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"

export default {
  input: "./src/jira-release.js",
  output: {
    file: "./dist/index.js",
    format: "cjs",
    exports: "auto",
  },
  plugins: [
    json(),
    commonjs(),
    nodeResolve({
      preferBuiltins: true,
    }),
  ],
}
