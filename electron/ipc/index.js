import { registerAppIpc } from './app.js'
import { registerWindowIpc } from './window.js'
import { registerAutoLaunchIpc } from './autoLaunch.js'
import { registerStoreIpc } from './store.js'
import { registerNotificationIpc } from './notification.js'

/**
 * 统一注册所有 IPC handlers
 * @param {object} mainObj 主进程状态：mainWindow, pagesWins, isLocked, store, app, createWindow
 */
export default function initWinIpcMain(mainObj) {
  // 应用信息与平台相关 IPC
  registerAppIpc(mainObj)
  // 窗口控制相关 IPC（主窗口与子窗口）
  registerWindowIpc(mainObj)
  // 开机自启动相关 IPC
  registerAutoLaunchIpc(mainObj)
  // 持久化 store 相关 IPC
  registerStoreIpc(mainObj)
  // 系统通知相关 IPC
  registerNotificationIpc(mainObj)
}
