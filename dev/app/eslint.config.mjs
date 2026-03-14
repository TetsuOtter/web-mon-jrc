import { createBaseConfig } from '../eslint.config.base.mjs'

export default [
  { ignores: ['node_modules', 'packages', 'dist', 'vite.config.ts', 'eslint.config.mjs', 'src-tauri/**'] },
  ...createBaseConfig('./tsconfig.json', import.meta.dirname),
]
