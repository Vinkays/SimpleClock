import { contextBridge, ipcRenderer } from 'electron'
import { APP, WINDOW, WINDOW_EVENT, AUTOLAUNCH, STORE, NOTIFICATION } from './ipc/channels.js'

const windowApi = {
  // 移动窗口至指定位置
  moveWindow: (payload, animate = true) =>
    ipcRenderer.invoke(WINDOW.MOVE, { x: payload.x, y: payload.y, animate }),
  // 窗口居中
  centerWindow: () => ipcRenderer.invoke(WINDOW.CENTER),
  // 获取窗口位置
  getWindowPosition: () => ipcRenderer.invoke(WINDOW.GET_POSITION),
  // 设置窗口位置
  setWindowPosition: (x, y) => ipcRenderer.invoke(WINDOW.SET_POSITION, { x, y }),
  // 设置窗口置顶
  setAlwaysOnTop: (isTop, level = 'screen-saver') =>
    ipcRenderer.invoke(WINDOW.SET_ALWAYS_ON_TOP, { isTop, level }),
  // 获取窗口置顶状态
  getAlwaysOnTop: () => ipcRenderer.invoke(WINDOW.GET_ALWAYS_ON_TOP),
  // 新增窗口
  addNewWindow: (name, position = undefined, size = [150, 150]) =>
    ipcRenderer.invoke(WINDOW.ADD, { name, position, size }),
  // 移除窗口
  removeWindow: (name) => ipcRenderer.invoke(WINDOW.REMOVE, { name }),
  // 设置窗口锁定
  setWinLocked: (isLocked) => ipcRenderer.invoke(WINDOW.SET_LOCKED, { isLocked }),
  // 获取窗口锁定状态
  getWinLocked: () => ipcRenderer.invoke(WINDOW.GET_LOCKED),
  // 监听窗口锁定状态
  onWinLocked: (callback) =>
    ipcRenderer.on(WINDOW_EVENT.LOCKED, (_event, isLocked) => callback(isLocked)),
  // 退出应用
  quitApp: () => ipcRenderer.invoke(WINDOW.QUIT),
  // 获取指定窗口的大小
  getWinSize: (name = 'main') => ipcRenderer.invoke(WINDOW.GET_SIZE, name),
}

const appApi = {
  // 获取当前运行平台
  getPlatform: () => ipcRenderer.invoke(APP.PLATFORM),
}

const autoLaunchApi = {
  // 获取开机自启动状态
  getAutoLaunch: () => ipcRenderer.invoke(AUTOLAUNCH.GET),
  // 设置开机自启动
  setAutoLaunch: (isAutoLaunch = false) => ipcRenderer.invoke(AUTOLAUNCH.SET, { isAutoLaunch }),
}

const storeApi = {
  // 设置持久化 store 状态
  setStoreWindowStates: (obj) => ipcRenderer.invoke(STORE.SET, obj),
  // 获取持久化 store 状态
  getStoreWindowStates: (keys) => ipcRenderer.invoke(STORE.GET, keys),
}

const notificationApi = {
  // 设置系统通知
  setNotification: (notice) => ipcRenderer.invoke(NOTIFICATION.SHOW, notice),
}

contextBridge.exposeInMainWorld('electronApi', {
  // 窗口相关 API, 窗口移动、位置、大小、置顶、锁定、退出、子窗口 
  window: windowApi,
  // 应用相关 API
  app: appApi,
  // 开机自启动相关 API
  autoLaunch: autoLaunchApi,
  // 持久化 store 相关 API
  store: storeApi,
  // 系统通知相关 API
  notification: notificationApi,
})

if (process.env.NODE_ENV === 'development') {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
}
