import { ipcMain } from 'electron'
import { APP } from './channels.js'

/**
 * 应用信息与平台相关 IPC
 * @param {object} _mainObj 未使用，保持与其他模块签名一致
 */
export function registerAppIpc(_mainObj) {
  console.log('registerAppIpc_mainObj', _mainObj);
  
  ipcMain.handle(APP.VERSION, () => {
    return process.env.npm_package_version ?? ''
  })

  ipcMain.handle(APP.NAME, () => {
    return process.env.npm_package_name ?? ''
  })

  ipcMain.handle(APP.PLATFORM, () => {
    return { success: true, platform: process.platform }
  })
}
