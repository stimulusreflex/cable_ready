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

export default [
  {
    external: ['morphdom'],
    input: 'javascript/index.js',
    output: [
      {
        name: 'CableReady',
        file: 'dist/cable_ready.umd.js',
        format: 'umd',
        sourcemap: true,
        exports: 'named',
        globals: { morphdom: 'morphdom' },
        plugins: [pretty()]
      },
      {
        file: 'dist/cable_ready.module.js',
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true,
        plugins: [pretty()]
      },
      {
        file: 'app/assets/javascripts/cable_ready.js',
        format: 'es',
        inlineDynamicImports: true,
        plugins: [pretty()]
      },
      {
        file: 'app/assets/javascripts/cable_ready.min.js',
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true,
        plugins: [minify()]
      }
    ],
    plugins: [commonjs(), resolve(), json()],
    watch: {
      include: 'javascript/**'
    }
  }
]
