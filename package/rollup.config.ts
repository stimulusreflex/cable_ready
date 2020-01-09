import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import uglify from 'rollup-plugin-uglify';

const pkg = require("./package.json")
const year = new Date().getFullYear()
const banner = `/*\nCableReady\nCopyright © ${year} Nathan Hopkins\n */`

const uglifyOptions = {
  mangle: false,
  compress: false,
  output: {
    beautify: true,
    indent_level: 2,
    comments: /Copyright/,
  },
}

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      name: "CableReady",
      format: "umd",
      sourcemap: true,
      banner,
    },
    { file: pkg.module, format: "es", sourcemap: true },
  ],
  watch: {
    include: "src/**",
  },
  context: "window",
  plugins: [
    typescript({ module: "CommonJS" }),
    commonjs({ extensions: [".js", ".ts"] }),
    resolve(),
    sourceMaps(),
    uglify(uglifyOptions),
  ],
}
