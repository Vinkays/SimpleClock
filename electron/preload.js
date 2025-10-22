const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronApi', {
  // 移动窗口
  moveWindow: ({x, y}, animate = true) => ipcRenderer.invoke('window-move', {x, y, animate}),
  // 居中窗口
  centerWindow: () =>ipcRenderer.invoke('window-center'),
  
  // 获取窗口当前位置
  getWindowPosition: () => ipcRenderer.invoke('window-get-position'),
  // 设置窗口位置
  setWindowPosition: (x,y) => ipcRenderer.invoke('window-set-position', {x,y}),
  // 设置窗口置顶
  setAlwaysOnTop: (isTop, level='screen-saver') => ipcRenderer.invoke('window-set-allways-on-top', {isTop, level}),
  // 获取窗口置顶状态
  getAlwaysOnTop: () => ipcRenderer.invoke('window-get-allways-on-top'),
  // 添加新窗口
  addNewWindow: (name, position = undefined, size = [150,150]) => ipcRenderer.invoke('add-new-window', {name,position, size}),
  // 移除窗口
  removeWindow: (name) => ipcRenderer.invoke('remove-window', {name}),
  // 锁定窗口
  setWinLocked: (isLocked) => ipcRenderer.invoke('window-set-locked', {isLocked}),
  // 获取窗口锁定状态
  getWinLocked: () => ipcRenderer.invoke('window-get-locked'),
  onWinLocked: (callback) => ipcRenderer.on('window-locked', (event, isLocked)=>callback(isLocked)),
  // 退出应用
  quitApp: () => ipcRenderer.invoke('window-quit'),
  // 自动启动
  getAutoLaunch: () => ipcRenderer.invoke('window-get-autoLaunch'),
  // 设置自动启动
  setAutoLaunch: (isAutoLaunch = false) => ipcRenderer.invoke('window-set-autoLaunch', {isAutoLaunch}),
  // 获取指定窗口的大小
  getWinSize: (name = 'main') => ipcRenderer.invoke('window-get-size', name),
  // 存储
  setStoreWindowStates: (obj) => ipcRenderer.invoke('window-set-store-states', obj),
  // 获取存储内容
  getStoreWindowStates: (keys) => ipcRenderer.invoke('window-get-store-states', keys),
  // 通知
  setNotification: (notice) => ipcRenderer.invoke('window-set-notification', notice),
})

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';