import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import pkg from "./package.json";

const banner = `/*!
 * vue-reactive-persisted v${pkg.version}
 * (c) ${new Date().getFullYear()} Eliott Vincent
 * @license MIT
 */`;

const configs = [
  {
    input: "src/index.js",
    file: "dist/vue-reactive-persisted.esm-browser.js",
    format: "es"
  },
  {
    input: "src/index.js",
    file: "dist/vue-reactive-persisted.esm-bundler.js",
    format: "es"
  },
  {
    input: "src/index.cjs.js",
    file: "dist/vue-reactive-persisted.global.js",
    format: "iife",
    minify: true
  },
  {
    input: "src/index.cjs.js",
    file: "dist/vue-reactive-persisted.cjs.js",
    format: "cjs",
    env: "development"
  }
];

function createEntries() {
  return configs.map(config => {
    return createEntry(config);
  });
}

function createEntry(config) {
  const isGlobalBuild = config.format === "iife";

  const c = {
    external: ["vue"],
    input: config.input,
    plugins: [
      resolve(),
      commonjs()
    ],
    output: {
      banner,
      file: config.file,
      format: config.format,
      exports: "auto",
      globals: {
        vue: "Vue"
      }
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg);
      }
    }
  };

  if (isGlobalBuild) {
    c.output.name = "Persist";
  }

  if (config.minify) {
    c.plugins.push(terser());
  }

  return c;
}

export default createEntries();
