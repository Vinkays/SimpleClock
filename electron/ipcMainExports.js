import { 
  ipcMain, 
  Notification,
  nativeImage
 } from 'electron';
import { checkAutoStartFromRegistry, addAutoStartToRegistry, removeAutoStartFromRegistry } from './utils.js'
import fs from 'fs'

// 窗口控制
export default function initWinIpcMain(mainObj) {
  // 获取应用版本
  ipcMain.on('get-app-version', (event) => {
    event.returnValue = process.env.npm_package_version;
  });

  // 获取应用名称
  ipcMain.on('get-app-name', (event) => {
    event.returnValue = process.env.npm_package_name;
  })

  // 窗口移动，设置位置
  ipcMain.handle('window-move', (event,{x,y, animate = true}) => {
    const { mainWindow, isLocked } = mainObj;
    if(isLocked) return { success: false, message: '锁定状态不允许移动' }; // 锁定状态不允许移动
    if(mainWindow) {
      const position = mainWindow.getPosition();
      const [oldX, oldY] = position;
      mainWindow.setPosition(oldX+x, oldY+y, animate);
      return ({ success: true, x, y });
    }
    return { success: false };
  });

  // 窗口居中
  ipcMain.handle('window-center', () => {
    const { mainWindow, isLocked } = mainObj;
    if(isLocked) return { success: false, message: '锁定状态不允许移动' }; // 锁定状态不允许移动
    if(mainWindow){
      mainWindow.center();
      return ({ success: true } )
    }
    return { success: false };
  });

  // 获取窗口位置
  ipcMain.handle('window-get-position', async () => {
    const { mainWindow } = mainObj;
    if(mainWindow){
      const position = mainWindow.getPosition();
      return ({ success: true, x: position[0], y: position[1] });
    }
    return { success: false };
  })

  // 设置窗口大小
  ipcMain.handle('window-set-size', async (event,{width,height}) => {
    const { mainWindow,isLocked } = mainObj;
    if(isLocked) return { success: false, message: '锁定状态不允许移动' }; // 锁定状态不允许移动
    if(mainWindow){
      mainWindow.setSize(width,height);
      return ({ success: true })
    }
    return { success: false };
  })
  ipcMain.handle('window-set-position', async (event,{x,y}) => {
    const { mainWindow, isLocked } = mainObj;
    
    if(isLocked) return { success: false, message: '锁定状态不允许移动' }; // 锁定状态不允许移动
    if(mainWindow){
      mainWindow.setPosition(x,y);
      return ({ success: true })
    }
    return { success: false };
  })
  // 窗口置顶
  ipcMain.handle('window-set-allways-on-top', async (event,{isTop, level = 'screen-saver'}) => {
    const { mainWindow, pagesWins } = mainObj;
    if(mainWindow && isTop){
      mainWindow.setAlwaysOnTop(true, level) // 窗口置顶
      // 置顶状态，所有页面窗口也置顶，避免页面窗口被遮挡
      Object.keys(pagesWins).forEach(key => {
        pagesWins[key]?.setAlwaysOnTop(true, level)
      })
    } else {
      mainWindow?.setAlwaysOnTop(false, 'floating') // 取消置顶
      Object.keys(pagesWins).forEach(key => {
        pagesWins[key]?.setAlwaysOnTop(false, 'floating')
      })
    }
    return ({ success: true })
  })
  // 获取窗口置顶状态
  ipcMain.handle('window-get-allways-on-top', async () => {
    const { mainWindow } = mainObj;
    return ({ success: true, isTop: mainWindow?.isAlwaysOnTop() })
  })
  // 锁定窗口
  ipcMain.handle('window-set-locked', async (event,{isLocked = false}) => {
    mainObj.isLocked = isLocked;
    mainObj.mainWindow.setResizable(!isLocked)
    mainObj.mainWindow.webContents.send('window-locked', isLocked)
    return ({ success: true})
  })
  // 获取窗口锁定状态
  ipcMain.handle('window-get-locked', async () => {
    const { isLocked } = mainObj;
    return ({ success: true, isLocked })
  })
  // 退出应用
  ipcMain.handle('window-quit', async () => {
    mainObj.app.quit()
    return ({ success: true })
  })
  // 获取自动启动状态
  ipcMain.handle('window-get-autoLaunch', async () => {
    try {
      const openAtLogin = await checkAutoStartFromRegistry()
      return ({ success: true, isAutoLaunch: openAtLogin });
    } catch (error) {
      return ({ success: false, isAutoLaunch: false });
    }
  })
  // 设置自动启动
  ipcMain.handle('window-set-autoLaunch', (event, {isAutoLaunch = false}) => {
    try {
      if(isAutoLaunch) {
        return addAutoStartToRegistry();
      }
      return removeAutoStartFromRegistry()
    } catch (error) {
      return ({ success: false, message: error?.message });
    }
  })
  ipcMain.handle('window-get-size', (event, name) => {    
    if(mainObj.pagesWins[name]) {
      const size = mainObj.pagesWins[name].getSize();      
      return ({ success: true, size, message: '成功' })
    }
    return ({ success: true, size: [], message: '未找到窗口' })
  })

  // 设置store状态
  ipcMain.handle('window-set-store-states', (event, obj) => {
    if(obj && Object.prototype.toString.call(obj) === '[object Object]'){
      Object.keys(obj).forEach(key => {
        mainObj.store.set(key, obj[key])
      })
      return ({ success: true, message: '成功' })
    }
    return ({ success: false, message: '参数错误' })
  })
  // 获取store状态
  ipcMain.handle('window-get-store-states', (event, keys) => {
    if(keys) {
      if(Array.isArray(keys)){
        const obj = {}
        keys.forEach(key => {
          obj[key] = mainObj.store.get(key)
        })
        return ({ success: true, data: obj, message: '成功' })
      } else {
        return ({ success: true, data: mainObj.store.get(keys), message: '成功' })
      }
    } else {
      return ({ success: true, data: mainObj.store.getAll(), message: '成功' })
    }
  })

  // 创建通知
  ipcMain.handle('window-set-notification', (event, notice) => {
    if(Notification?.isSupported()) {
      try {
        const notify = new Notification({
          ...notice,
        })        
        notify.show();
        return ({ success: true, message: '成功' })
      } catch (error) {        
        return ({ success: false, message: '当前环境不支持通知' })
      }
    }
    return ({ success: false, message: '当前环境不支持通知' })
  })
}

