/**
 * Preload 在 Electron 中默认以 CommonJS 方式执行，使用 import 会报错导致脚本不运行、electronApi 未注入。
 * Channel 名称在此内联，需与 electron/ipc/channels.js 保持一致。
 */
const { contextBridge, ipcRenderer } = require('electron')

const APP = {
  VERSION: 'app:version',
  NAME: 'app:name',
  PLATFORM: 'app:platform',
  IS_UPDATE_PENDING: 'app:is-update-pending',
  QUIT_AND_INSTALL: 'app:quit-and-install',
}
const WINDOW = {
  MOVE: 'window:move',
  CENTER: 'window:center',
  GET_POSITION: 'window:get-position',
  SET_POSITION: 'window:set-position',
  GET_SIZE: 'window:get-size',
  SET_SIZE: 'window:set-size',
  SET_ALWAYS_ON_TOP: 'window:set-always-on-top',
  GET_ALWAYS_ON_TOP: 'window:get-always-on-top',
  SET_LOCKED: 'window:set-locked',
  GET_LOCKED: 'window:get-locked',
  QUIT: 'window:quit',
  ADD: 'window:add',
  REMOVE: 'window:remove',
}
const WINDOW_EVENT = { LOCKED: 'window:locked' }
const AUTOLAUNCH = { GET: 'autoLaunch:get', SET: 'autoLaunch:set' }
const STORE = { GET: 'store:get', SET: 'store:set' }
const NOTIFICATION = { SHOW: 'notification:show' }

const windowApi = {
  moveWindow: (payload, animate = true) =>
    ipcRenderer.invoke(WINDOW.MOVE, { x: payload.x, y: payload.y, animate }),
  centerWindow: () => ipcRenderer.invoke(WINDOW.CENTER),
  getWindowPosition: () => ipcRenderer.invoke(WINDOW.GET_POSITION),
  setWindowPosition: (x, y) => ipcRenderer.invoke(WINDOW.SET_POSITION, { x, y }),
  setAlwaysOnTop: (isTop, level = 'screen-saver') =>
    ipcRenderer.invoke(WINDOW.SET_ALWAYS_ON_TOP, { isTop, level }),
  getAlwaysOnTop: () => ipcRenderer.invoke(WINDOW.GET_ALWAYS_ON_TOP),
  addNewWindow: (name, position = undefined, size = [150, 150]) =>
    ipcRenderer.invoke(WINDOW.ADD, { name, position, size }),
  removeWindow: (name) => ipcRenderer.invoke(WINDOW.REMOVE, { name }),
  setWinLocked: (isLocked) => ipcRenderer.invoke(WINDOW.SET_LOCKED, { isLocked }),
  getWinLocked: () => ipcRenderer.invoke(WINDOW.GET_LOCKED),
  onWinLocked: (callback) =>
    ipcRenderer.on(WINDOW_EVENT.LOCKED, (_event, isLocked) => callback(isLocked)),
  quitApp: () => ipcRenderer.invoke(WINDOW.QUIT),
  getWinSize: (name = 'main') => ipcRenderer.invoke(WINDOW.GET_SIZE, name),
}

const appApi = {
  getPlatform: () => ipcRenderer.invoke(APP.PLATFORM),
  isUpdatePending: () => ipcRenderer.invoke(APP.IS_UPDATE_PENDING),
  quitAndInstall: () => ipcRenderer.invoke(APP.QUIT_AND_INSTALL),
  onUpdatePending: (callback) => ipcRenderer.on('app:update-pending', (_event, value) => callback(value)),
}

const autoLaunchApi = {
  getAutoLaunch: () => ipcRenderer.invoke(AUTOLAUNCH.GET),
  setAutoLaunch: (isAutoLaunch = false) => ipcRenderer.invoke(AUTOLAUNCH.SET, { isAutoLaunch }),
}

const storeApi = {
  setStoreWindowStates: (obj) => ipcRenderer.invoke(STORE.SET, obj),
  getStoreWindowStates: (keys) => ipcRenderer.invoke(STORE.GET, keys),
}

const notificationApi = {
  setNotification: (notice) => ipcRenderer.invoke(NOTIFICATION.SHOW, notice),
}

contextBridge.exposeInMainWorld('electronApi', {
  window: windowApi,
  app: appApi,
  autoLaunch: autoLaunchApi,
  store: storeApi,
  notification: notificationApi,
})

if (process.env.NODE_ENV === 'development') {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
}