import { ipcMain } from 'electron'
import { WINDOW, WINDOW_EVENT } from './channels.js'

/**
 * 窗口控制相关 IPC（主窗口与子窗口）
 * @param {{ mainWindow: Electron.BrowserWindow|null, pagesWins: object, isLocked: boolean, store: object, app: Electron.App, createWindow: function }} mainObj
 */
export function registerWindowIpc(mainObj) {
  ipcMain.handle(WINDOW.MOVE, (_event, { x, y, animate = true }) => {
    const { mainWindow, isLocked } = mainObj
    if (isLocked) return { success: false, message: '锁定状态不允许移动' }
    if (mainWindow) {
      const [oldX, oldY] = mainWindow.getPosition()
      mainWindow.setPosition(oldX + x, oldY + y, animate)
      return { success: true, x, y }
    }
    return { success: false }
  })

  ipcMain.handle(WINDOW.CENTER, () => {
    const { mainWindow, isLocked } = mainObj
    if (isLocked) return { success: false, message: '锁定状态不允许移动' }
    if (mainWindow) {
      mainWindow.center()
      return { success: true }
    }
    return { success: false }
  })

  ipcMain.handle(WINDOW.GET_POSITION, async () => {
    const { mainWindow } = mainObj
    if (mainWindow) {
      const position = mainWindow.getPosition()
      return { success: true, x: position[0], y: position[1] }
    }
    return { success: false }
  })

  ipcMain.handle(WINDOW.SET_SIZE, async (_event, { width, height }) => {
    const { mainWindow, isLocked } = mainObj
    if (isLocked) return { success: false, message: '锁定状态不允许调整窗口大小' }
    if (mainWindow) {
      mainWindow.setSize(width, height)
      return { success: true }
    }
    return { success: false }
  })

  ipcMain.handle(WINDOW.SET_POSITION, async (_event, { x, y }) => {
    const { mainWindow, isLocked } = mainObj
    if (isLocked) return { success: false, message: '锁定状态不允许移动' }
    if (mainWindow) {
      mainWindow.setPosition(x, y)
      return { success: true }
    }
    return { success: false }
  })

  ipcMain.handle(WINDOW.SET_ALWAYS_ON_TOP, async (_event, { isTop, level = 'screen-saver' }) => {
    const { mainWindow, pagesWins, store } = mainObj
    const status = isTop ? level : 'floating'
    mainWindow?.setAlwaysOnTop(isTop, status)
    Object.keys(pagesWins).forEach(key => {
      pagesWins[key]?.setAlwaysOnTop(isTop, status)
    })
    store.set('isAlwaysOnTop', isTop)
    return { success: true }
  })

  ipcMain.handle(WINDOW.GET_ALWAYS_ON_TOP, async () => {
    const { mainWindow } = mainObj
    return { success: true, isTop: mainWindow?.isAlwaysOnTop() }
  })

  ipcMain.handle(WINDOW.SET_LOCKED, async (_event, { isLocked = false }) => {
    mainObj.isLocked = isLocked
    mainObj.mainWindow.setResizable(!isLocked)
    mainObj.mainWindow.webContents.send(WINDOW_EVENT.LOCKED, isLocked)
    return { success: true }
  })

  ipcMain.handle(WINDOW.GET_LOCKED, async () => {
    return { success: true, isLocked: mainObj.isLocked }
  })

  ipcMain.handle(WINDOW.QUIT, async () => {
    mainObj.app.quit()
    return { success: true }
  })

  ipcMain.handle(WINDOW.GET_SIZE, (_event, name) => {
    if (mainObj.pagesWins[name]) {
      const size = mainObj.pagesWins[name].getSize()
      return { success: true, size, message: '成功' }
    }
    return { success: true, size: [], message: '未找到窗口' }
  })

  ipcMain.handle(WINDOW.ADD, (_event, { name, position, size = [150, 150] }) => {
    const { pagesWins, createWindow, mainWindow } = mainObj
    if (pagesWins[name]) return { success: false, message: '窗口已存在' }
    if (typeof createWindow !== 'function') return { success: false, message: '窗口创建不可用' }
    const win = createWindow(name, size, position)
    win.on('closed', () => {
      delete pagesWins[name]
    })
    mainObj.pagesWins[name] = win
    const isMainWinTop = mainWindow?.isAlwaysOnTop?.()
    if (isMainWinTop) win.setAlwaysOnTop(true, 'screen-saver')
    win.on('blur', () => {
      win.close()
      delete mainObj.pagesWins[name]
    })
    return mainObj.pagesWins[name] ? { success: true, message: '窗口创建成功' } : { success: false, message: '窗口创建失败' }
  })

  ipcMain.handle(WINDOW.REMOVE, (_event, { name }) => {
    if (mainObj.pagesWins[name]) {
      mainObj.pagesWins[name].close()
      delete mainObj.pagesWins[name]
      return { success: true }
    }
    return { success: false }
  })
}
