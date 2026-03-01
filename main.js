import { app, BrowserWindow, dialog } from 'electron';
import electronAutoUpdater from 'electron-updater';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import initWinIpcMain from './electron/ipc/index.js'
import SimpleStore from './electron/storage.js'
import { getCurrentScreen, physicalToCss } from './electron/utils.js';

const { autoUpdater } = electronAutoUpdater;

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
  const pos = position ? {...position} : null
  // 如果窗口位置和大小超出屏幕范围，则调整窗口位置
  const [w, h] = size || [150,150]
  if(name!=='main' && position && size) {
    const screen = getCurrentScreen(mainObj.mainWindow)
    const { width, height, x, y } = screen.bounds    
    // const screeMinX = physicalToCss(x)
    // const screeMinY = physicalToCss(y)
    const screeMaxX = physicalToCss(x + width)
    const screeMaxY = physicalToCss(y + height)
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
    width: w,
    height: h,
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
  const isAlwaysOnTop = !!store.get('isAlwaysOnTop'); 
  const win = createWindow('main', oldSize, oldPosition)
  win.setAlwaysOnTop(isAlwaysOnTop, isAlwaysOnTop?'screen-saver':'floating') // 设置窗口置顶
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

mainObj.createWindow = createWindow
initWinIpcMain(mainObj) // 初始化 IPC（含 add-new-window / remove-window）

app.whenReady().then(() => {
  createMainWindow()

  // 仅在生产环境启用自动更新（需在 electron-builder 中配置 publish 才有更新源）
  if (!isDev) {
    autoUpdater.autoDownload = true
    autoUpdater.autoInstallOnAppQuit = true

    autoUpdater.on('update-available', (info) => {
      console.log('[autoUpdater] 发现新版本:', info.version)
    })

    autoUpdater.on('update-downloaded', () => {
      // 不传父窗口（null），对话框作为独立窗口显示，避免主窗口过小时被裁切或显示不全
      dialog.showMessageBox(null, {
        type: 'info',
        title: '更新就绪',
        message: '新版本已下载完成，是否立即重启应用以完成更新？',
        buttons: ['立即重启', '稍后'],
        defaultId: 0,
        cancelId: 1,
      }).then(({ response }) => {
        if (response === 0) autoUpdater.quitAndInstall(false, true)
      })
    })

    autoUpdater.on('error', (err) => {
      console.error('[autoUpdater] 检查更新失败:', err.message)
    })

    try {
      autoUpdater.checkForUpdatesAndNotify()
    } catch (error) {
      console.error('[autoUpdater] 启动检查失败:', error)
    }
  }
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
