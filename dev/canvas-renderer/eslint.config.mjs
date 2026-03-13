import { createBaseConfig } from '../eslint.config.base.mjs'

export default [
  { ignores: ['node_modules', 'packages', 'dist', 'vite.config.ts', 'eslint.config.mjs', 'vitest.config.ts', 'vitest.setup.ts', 'src/**/__tests__/**'] },
  ...createBaseConfig('./tsconfig.json'),
]
