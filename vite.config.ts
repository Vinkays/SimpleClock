import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import viteClean from 'vite-plugin-clean'


const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteClean({
      targetFiles: ['dist', 'output']
    })
  ] as import('vite').Plugin[],
  server: {
    host: '0.0.0.0',
    port: 5120,
    open: false,
  },
  root: '.',
  base: './',
  build: {
    emptyOutDir: true, // 构建前清空输出目录
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'pages/main.html',
        rightMenus: 'pages/rightMenus.html',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },

    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  }
})
