import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'

const pretty = () => {
  return terser({
    mangle: false,
    compress: false,
    format: {
      comments: 'all',
      beautify: true,
      indent_level: 2
    }
  })
}

const esConfig = {
  format: 'es',
  inlineDynamicImports: true
}

const umdConfig = {
  name: 'CableReady',
  format: 'umd',
  exports: 'named',
  globals: { morphdom: 'morphdom' }
}

const baseName = 'cable_ready'
const distFolders = ['dist', 'app/assets/javascripts']

const output = distFolders
  .map(distFolder => [
    {
      ...esConfig,
      file: `${distFolder}/${baseName}.js`,
      plugins: [pretty()]
    },
    {
      ...umdConfig,
      file: `${distFolder}/${baseName}.umd.js`,
      plugins: [pretty()]
    }
  ])
  .flat()

export default [
  {
    external: ['morphdom'],
    input: 'javascript/index.js',
    output,
    plugins: [resolve(), json()],
    watch: {
      include: 'javascript/**'
    }
  }
]
