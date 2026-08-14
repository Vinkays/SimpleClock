import { ipcMain } from 'electron'
import { APP, EVENT } from './channels.js'

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

  ipcMain.handle(APP.QUIT_APP, async () => {
    mainObj.app.quit()
    return { success: true }
  })
  // 设置当前应用外观设置
  ipcMain.handle(APP.SET_APPEARANCE, async (_event, appearance) => {
    for (const key in appearance) {
      mainObj.appearance[key] = appearance[key]
    }
    mainObj.store.set('appearance', mainObj.appearance)
    for (const winName in mainObj.pagesWins) {
      mainObj.pagesWins[winName].webContents.send(EVENT.APPEARANCE_CHANGED, mainObj.appearance)
    }
    return { success: true, message: '成功' }
  })
  // 获取当前应用外观设置
  ipcMain.handle(APP.GET_APPEARANCE, async (_event) => {
    return { success: true, appearance: mainObj.appearance, message: '成功' }
  })
}
