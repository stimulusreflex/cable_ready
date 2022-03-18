import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

const pretty = () => {
  return terser({
    mangle: false,
    compress: false,
    format: {
      beautify: true,
      indent_level: 2
    }
  })
}

const minify = () => {
  return terser({
    mangle: true,
    compress: true
  })
}

const esConfig = {
  format: 'es',
  inlineDynamicImports: true,
}

const umdConfig = {
  name: 'CableReady',
  format: 'umd',
  exports: 'named',
  globals: { morphdom: 'morphdom' },
}

const distFolders = [
  'dist/',
  'app/assets/javascripts/'
]

export default [
  {
    external: ['morphdom'],
    input: 'javascript/index.js',
    output: distFolders.map(distFolder => [
      {
        ...esConfig,
        file: `${distFolder}/cable_ready.js`,
        plugins: [pretty()]
      },
      {
        ...esConfig,
        file: `${distFolder}/cable_ready.min.js`,
        sourcemap: true,
        plugins: [minify()]
      },
      {
        ...umdConfig,
        file: `${distFolder}/cable_ready.umd.js`,
        plugins: [pretty()]
      },
      {
        ...umdConfig,
        file: `${distFolder}/cable_ready.umd.min.js`,
        sourcemap: true,
        plugins: [minify()]
      }
    ]).flat(),
    plugins: [commonjs(), resolve(), json()],
    watch: {
      include: 'javascript/**'
    }
  }
]
