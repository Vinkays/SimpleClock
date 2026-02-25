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
)

