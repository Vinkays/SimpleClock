import fs from "fs";

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

export default async () => {
  const { name, version, author, description } = pkg
  return {
    appId: `com.${author}.${name}`,
    productName: name,
    copyright: `Copyright ©2025 ${author}`,
    directories: {
      output: 'output'
    },
    // 核心修复：用 FileSet 显式复制 dist、electron，避免 glob 在 Windows/CI 下漏掉
    files: [
      'main.js',
      // 前端构建产物，主窗口 loadFile('dist/pages/main.html') 依赖
      { from: 'dist', to: 'dist', filter: ['**/*'] },
      // 主进程与 preload（ipc、utils、autoStart、storage 等）
      { from: 'electron', to: 'electron', filter: ['**/*'] },
      // 排除不需要打包的根目录内容
      '!src',
      '!.vscode',
      '!README.md',
      '!tsconfig.*',
      '!vite.config.*',
      '!.npmrc',
      '!.gitignore',
      '!package-lock.json',
      '!pnpm-lock.yaml',
      '!public/**/*',
      '!pages/**/*',
      '!electron-builder.config.js',
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
        {
          target: 'zip',
          arch: ['arm64', 'x64', 'universal'],
        },
      ],
    },
    // Linux：AppImage 为单文件便携版，无需安装、可放任意路径运行；deb/rpm 为系统包，安装路径由包管理决定
    linux: {
      target: [
        {
          target: 'AppImage',
          arch: ['x64', 'arm64'],
        },
      ],
    },
    // Windows NSIS：已支持自定义安装路径（安装时可选择目录）
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
        owner: 'Vinkays',           // 改成你的 GitHub 用户名
        repo: 'SimpleClock',             // 改成你的仓库名（若仓库名是 SimpleClock 请改这里）
      },
    ],
  }
}