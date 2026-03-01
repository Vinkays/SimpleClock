import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

export default defineConfigWithVueTs(
  {
    ignores: [
      'dist/**',
      'output/**',
      'output*/**',
      'node_modules/**',
      '*.log',
    ],
  },
  // Vue 3 常用规则
  pluginVue.configs['flat/essential'],
  // TypeScript 推荐规则
  vueTsConfigs.recommended,
  {
    rules: {
      // 可根据偏好逐步收紧
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
    },
  },
  // Electron preload 必须用 CommonJS require，在此放宽禁止 require 的规则
  {
    files: ['electron/preload.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
)

