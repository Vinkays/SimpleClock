import { ipcMain } from 'electron'
import { APP } from './channels.js'

/**
 * 应用信息、平台与更新相关 IPC
 * @param {object} mainObj 主进程对象，含 updatePending、quitAndInstall
 */
export function registerAppIpc(mainObj) {
  ipcMain.handle(APP.VERSION, () => {
    return process.env.npm_package_version ?? ''
  })

  ipcMain.handle(APP.NAME, () => {
    return process.env.npm_package_name ?? ''
  })

  ipcMain.handle(APP.PLATFORM, () => {
    return { success: true, platform: process.platform }
  })

  ipcMain.handle(APP.IS_UPDATE_PENDING, () => {
    return mainObj.updatePending === true
  })

  ipcMain.handle(APP.QUIT_AND_INSTALL, () => {
    if (typeof mainObj.quitAndInstall === 'function') mainObj.quitAndInstall()
  })
}
