import { ipcMain } from 'electron'
import { isAutoStartEnabled, enableAutoStart, disableAutoStart } from '../autoStart.js'
import { AUTOLAUNCH } from './channels.js'

/**
 * 开机自启动相关 IPC
 * @param {object} _mainObj 未使用，保持与其他模块签名一致
 */
export function registerAutoLaunchIpc(_mainObj) {
  console.log('registerAutoLaunchIpc_mainObj', _mainObj);
  ipcMain.handle(AUTOLAUNCH.GET, async () => {
    try {
      const openAtLogin = await isAutoStartEnabled()
      return { success: true, isAutoLaunch: openAtLogin }
    } catch (error) {
      return { success: false, isAutoLaunch: false, message: error?.message }
    }
  })

  ipcMain.handle(AUTOLAUNCH.SET, async (_event, { isAutoLaunch = false }) => {
    try {
      const result = isAutoLaunch ? await enableAutoStart() : await disableAutoStart()
      return result
    } catch (error) {
      return { success: false, message: error?.message }
    }
  })
}
