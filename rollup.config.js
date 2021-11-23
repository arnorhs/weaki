import typescript from 'rollup-plugin-ts'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import packageJson from './package.json'

export default {
  input: './src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: false,
    },
  ],
  external: [...Object.keys(packageJson.dependencies ?? {}), 'fs/promises'],
  plugins: [
    resolve({ preferBuiltins: true }),
    json(),
    commonjs(),
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
  ],
}
