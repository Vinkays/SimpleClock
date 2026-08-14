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
  QUIT_APP: 'app:quit',
  SET_APPEARANCE: 'app:set-appearance',
  GET_APPEARANCE: 'app:get-appearance',
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
  ADD: 'window:add',
  REMOVE: 'window:remove',
  BEGIN_WINDOW_DRAG: 'window:begin-window-drag',
  BEGIN_MOVE: 'window:begin-move',
  END_MOVE: 'window:end-move',
}
const EVENT = { 
  LOCKED: 'event:locked',
  APPEARANCE_CHANGED: 'event:appearance-changed',
  UPDATE_PENDING: 'event:update-pending',
 }
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
  getWinSize: (name = 'main') => ipcRenderer.invoke(WINDOW.GET_SIZE, name),
  beginMove: () => ipcRenderer.invoke(WINDOW.BEGIN_MOVE),
  endMove: () => ipcRenderer.invoke(WINDOW.END_MOVE),
  beginWindowDrag: () => ipcRenderer.invoke(WINDOW.BEGIN_WINDOW_DRAG),
}

const appApi = {
  getPlatform: () => ipcRenderer.invoke(APP.PLATFORM),
  isUpdatePending: () => ipcRenderer.invoke(APP.IS_UPDATE_PENDING),
  quitAndInstall: () => ipcRenderer.invoke(APP.QUIT_AND_INSTALL),
  quitApp: () => ipcRenderer.invoke(APP.QUIT_APP),
  setAppearance: (appearance) => ipcRenderer.invoke(APP.SET_APPEARANCE, appearance),
  getAppearance: () => ipcRenderer.invoke(APP.GET_APPEARANCE),
}

const eventApi = {
  onAppearanceChanged: (callback) => ipcRenderer.on(EVENT.APPEARANCE_CHANGED, (_event, value) => callback(value)),
  onWinLocked: (callback) => ipcRenderer.on(EVENT.LOCKED, (_event, isLocked) => callback(isLocked)),
  onUpdatePending: (callback) => ipcRenderer.on(EVENT.UPDATE_PENDING, (_event, value) => callback(value)),
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
  event: eventApi,
})

if (process.env.NODE_ENV === 'development') {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
}