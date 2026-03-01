import { ipcMain, Notification } from 'electron'
import { NOTIFICATION } from './channels.js'

/**
 * 系统通知相关 IPC
 * @param {object} _mainObj 未使用，保持与其他模块签名一致
 */
export function registerNotificationIpc(_mainObj) {
  console.log('registerNotificationIpc_mainObj', _mainObj);
  ipcMain.handle(NOTIFICATION.SHOW, (_event, notice) => {
    if (Notification?.isSupported()) {
      try {
        const notify = new Notification({ ...notice })
        notify.show()
        return { success: true, message: '成功' }
      } catch (error) {
        return { success: false, message: '当前环境不支持通知', error: error?.message }
      }
    }
    return { success: false, message: '当前环境不支持通知', error: '当前环境不支持通知' }
  })
}
