import fs from "fs";

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

export default async () => {
  const { name, version, author,description } = pkg
  return {
    appId: `com.${author}.${name}`,
    productName: name,
    copyright: `Copyright ©2025 ${author}`,
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
      "!pnpm-lock.yaml",
      "!public/**/*",
      "!pages/**/*",
      "!electron-builder.config.js",
    ],
    executableName: name,
    extraMetadata: {
      name,
      version,
      description,
    },
    asar: false,
    // 确保 electron-store 相关模块解析正常（即使后续开启 asar 也生效）
    asarUnpack: [],
    compression: "maximum",
    forceCodeSigning: false,
    electronLanguages: ["en", "zh-CN"],
    win: {
      target: [{
        target: 'nsis',
        arch: ['x64']
      }],
      icon: 'electron/favicon.ico',
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
      installerIcon: 'electron/favicon.ico',
      uninstallerIcon: 'electron/favicon.ico',
      menuCategory: "SimpleClock",
      include: "electron/autoLaunch.nsh",
      language: "2052",
      installerLanguages: ["zh-CN"],
      warningsAsErrors: false,
    },
    // 自动更新：必须配置 publish，打包后的应用才会知道去哪里检查更新；未配置则 checkForUpdatesAndNotify 不会收到推送
    // GitHub：在 Releases 页上传安装包与 latest.yml（由 electron-builder 打包时生成），公开仓库无需 token
    publish: [
      {
        provider: 'github',
        owner: 'Vinkay',           // 改成你的 GitHub 用户名
        repo: 'SimpleClock',             // 改成你的仓库名（若仓库名是 SimpleClock 请改这里）
      },
    ],
  }
}