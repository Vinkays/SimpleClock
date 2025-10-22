export default {
  appId: 'com.vinkay.SimpleClock',
  productName: 'SimpleClock',
  copyright: 'Copyright ©2025 Vinkay',
  directories: {
    output: 'output'
  },
  // 核心修复：调整 files 规则，确保 electron-store 及其依赖完整打包
  files: [
    'dist/**/*',                // 保留 Vite 构建的前端资源（页面、JS、CSS 等）
    'electron/**/*',            // 保留 Electron 主进程代码（main.js、preload.js 等
    'main.js',
    // 排除不需要打包的文件
    "!src",                   
    "!.vscode",
    "!README.md",
    "!tsconfig.*",
    "!vite.config.*",
    "!.npmrc",
    "!.gitignore",
    "!package-lock.json",
    "!package.json",
    "!pnpm-lock.yaml",
    "!public/**/*",
    "!pages/**/*",
    "!electron-builder.config.js",
  ],
  executableName: 'SimpleClock',
  extraMetadata: {
    name: 'SimpleClock',
    version: '1.0.0',
    description: 'A simple clock app',
  },
  asar: false,
  // 确保 electron-store 相关模块解析正常（即使后续开启 asar 也生效）
  asarUnpack: [],
  compression: "maximum",
  forceCodeSigning: false,
  electronLanguages: ["en", "zh-CN", "zh-TW"],
  win: {
    target: [{
      target: 'nsis',
      arch: ['x64']
    }],
    icon: 'electron/icon.ico',
  },
  mac: {
    target: [
      {
        target: 'dmg',
        arch: ['arm64', 'x64', 'universal'],
      },
      // 无论如何都要启用 zip，否则会影响 'dmg' 包中的自动更新
      {
        target: 'zip',
        arch: ['arm64', 'x64', 'universal'],
      },
    ],
  },
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64', 'arm64'],
      },
    ],
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: '简易时钟',
    installerIcon: 'electron/icon.ico',
    uninstallerIcon: 'electron/icon.ico',
    menuCategory: "SimpleClock",
    include: "electron/autoLaunch.nsh",
    language: "2052",
    installerLanguages: ["zh-CN"],
    warningsAsErrors: false,
  }
}