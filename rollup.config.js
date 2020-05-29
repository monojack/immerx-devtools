/* eslint-disable camelcase */
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
// import analyze from 'rollup-plugin-analyzer'
// import visualizer from 'rollup-plugin-visualizer'

const env = process.env.NODE_ENV

const config = {
  input: 'src/render.js',
  output: {
    format: 'umd',
    name: 'ImmerxDevTools',
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    postcss({
      extract: false,
      modules: true,
      use: ['sass'],
    }),
    resolve(),
    commonjs({
      namedExports: {
        'node_modules/react/index.js': [
          'useMemo',
          'useState',
          'useEffect',
          'useCallback',
          'memo',
        ],
      },
    }),
    // analyze(),
  ],
  onwarn: function(message, next) {
    if (message.code !== 'CIRCULAR_DEPENDENCY') {
      next(message)
    }
  },
}

if (env === 'production') {
  config.plugins.push(terser())
}

export default config
