import { ipcMain } from 'electron'
import { STORE } from './channels.js'

/**
 * 持久化 store 相关 IPC
 * @param {{ store: object }} mainObj
 */
export function registerStoreIpc(mainObj) {
  const { store } = mainObj

  ipcMain.handle(STORE.SET, (_event, obj) => {
    if (obj && Object.prototype.toString.call(obj) === '[object Object]') {
      Object.keys(obj).forEach(key => {
        store.set(key, obj[key])
      })
      return { success: true, message: '成功' }
    }
    return { success: false, message: '参数错误' }
  })

  ipcMain.handle(STORE.GET, (_event, keys) => {
    if (keys) {
      if (Array.isArray(keys)) {
        const obj = {}
        keys.forEach(key => {
          obj[key] = store.get(key)
        })
        return { success: true, data: JSON.stringify(obj), message: '成功' }
      }
      const d = store.get(keys)
      return { success: true, data: d ? JSON.stringify(d) : null, message: '成功' }
    }
    const d = store.getAll()
    return { success: true, data: d ? JSON.stringify(d) : null, message: '成功' }
  })
}
