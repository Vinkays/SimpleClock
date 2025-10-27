import { app, BrowserWindow, ipcMain, nativeImage } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import initWinIpcMain from './electron/ipcMainExports.js'
import SimpleStore from './electron/storage.js'
import { getCurrentScreen, physicalToCss } from './electron/utils.js';

// SimpleStore内部，为确保确保有写入权限，设置了用户数据目录，必须在app ready之前调用
const store = new SimpleStore()

const isDev = process.env.NODE_ENV === 'development'
const __dirname = dirname(fileURLToPath(import.meta.url))

// 设置应用ID（重要！）,通知中显示的应用名称
app.setAppUserModelId(app.getName() || 'SimpleClock'); // 设置应用ID
const mainObj = {
  mainWindow: null, // 主窗口
  isLocked: false, // 是否锁定窗口
  pagesWins: {},
  app,
  store,
}

// 检查是否已经有实例在运行
const gotTheLock = app.requestSingleInstanceLock(); // 尝试获取锁，返回true表示当前实例是唯一实例,false表示当前实例不是唯一实例
if (!gotTheLock) {
  app.quit()
}else {
  // 当第二个实例运行时，将会聚焦到主窗口
  app.on('second-instance', () => {
    if (mainObj.mainWindow) {
      if (mainObj.mainWindow.isMinimized()) mainObj.mainWindow.restore()
      mainObj.mainWindow.focus()
    }
  })
}

// 创建窗口
function createWindow (name, size, position) {
  let pos = position ? {...position} : null
  // 如果窗口位置和大小超出屏幕范围，则调整窗口位置
  if(name!=='main' && position && size) {
    const screen = getCurrentScreen(mainObj.mainWindow)
    const { width, height, x, y } = screen.bounds    
    const screeMinX = physicalToCss(x)
    const screeMinY = physicalToCss(y)
    const screeMaxX = physicalToCss(x + width)
    const screeMaxY = physicalToCss(y + height)
    const [w, h] = size
    // 判断窗口横向是否超出屏幕范围
    if(w + position.x > screeMaxX) {
      pos.x = screeMaxX - w - 10
    }
    // 判断窗口纵向是否超出屏幕范围
    if(h + position.y > screeMaxY) {
      pos.y = screeMaxY - h - 10
    }
  }
  const win = new BrowserWindow({
    width: size[0],
    height: size[1],
    type: 'toolbar',  // 窗口类型
    frame: false, // 隐藏窗口边框
    titleBarStyle: 'hidden', // 隐藏标题栏但保留窗口控制按钮
    autoHideMenuBar: false, // 隐藏菜单栏
    ...pos?{...pos}:{},
    webPreferences: {
      zoomFactor: 1.0, // 设置默认缩放级别
      nodeIntegration: false, // 关闭 Node.js 集成
      contextIsolation: true, // 重要：开启上下文隔离
      enableRemoteModule: false, // 重要：关闭 remote 模块
      webSecurity: true, // 重要：开启 web 安全
      allowRunningInsecureContent: false, // 禁止不安全内容
      devTools: true,
      preload: resolve(__dirname, 'electron/preload.js'),
    },
  })
  if(isDev){
    win.loadURL(`http://localhost:5120/pages/${name}.html`)
  }else{
    win.loadFile(`dist/pages/${name}.html`)
  }
  return win
}


// 创建主窗口
function createMainWindow () {
  const oldPosition = store.get('windowPosition');  
  const oldSize = store.get('windowSize') || [350, 100]; 
  const win = createWindow('main', oldSize, oldPosition)
  win.on('close',()=>{
    const position = win.getPosition()
    const size = win.getSize()    
    store.set('windowPosition', {x: position[0], y: position[1]})
    store.set('windowSize', size)
    app.quit()
  })
  mainObj.mainWindow = win
  mainObj.pagesWins['main'] = win
}
initWinIpcMain(mainObj) // 初始化ipcMain

// 创建新窗口
ipcMain.handle('add-new-window', (event, {name, position = undefined,size = [150,150]}) => {
  if(mainObj.pagesWins[name]) return ({success: false, message: '窗口已存在'}); // 如果窗口已经存在，则不创建新窗口
  const win = createWindow(name, size, position)
  win.on('closed', () => {
    delete mainObj.pagesWins[name]
  })
  mainObj.pagesWins[name] = win
  const isMainWinTop = mainObj.mainWindow.isAlwaysOnTop()
  if(isMainWinTop) {
    win.setAlwaysOnTop(true, 'screen-saver')
  }
  win.on('blur', () => {
    win.close()
    delete mainObj.pagesWins[name]
  })
  if(mainObj.pagesWins[name]) {
    return ({success: true, message: '窗口创建成功'});
  }
  return ({success: false, message: '窗口创建失败'});
})

ipcMain.handle('remove-window', (event, {name}) => {
  if(mainObj.pagesWins[name]){
     mainObj.pagesWins[name].close()
    delete mainObj.pagesWins[name]
    return ({success: true});
  }
  return ({success: false})
})

app.whenReady().then(() => {
  createMainWindow()
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
