interface WindowApi {
  // 窗口移动
  moveWindow: (payload: { x: number; y: number }, animate?: boolean) => Promise<{ success: boolean; x?: number; y?: number }>
  // 窗口居中
  centerWindow: () => Promise<{ success: boolean }>
  // 获取窗口位置
  getWindowPosition: () => Promise<{ success: boolean; x: number; y: number }>
  // 设置窗口位置
  setWindowPosition: (x: number, y: number) => Promise<{ success: boolean }>
  // 设置窗口置顶
  setAlwaysOnTop: (isTop: boolean, level?: 'pop-up-menu' | 'screen-saver') => Promise<{ success: boolean }>
  // 获取窗口置顶状态
  getAlwaysOnTop: () => Promise<{ success: boolean; isTop: boolean }>
  // 新增窗口
  addNewWindow: (name: string, position?: { x: number; y: number }, size?: [number, number]) => Promise<{ success: boolean; message?: string }>
  // 移除窗口
  removeWindow: (name: string) => Promise<{ success: boolean; message?: string }>
  // 设置窗口锁定
  setWinLocked: (isLocked: boolean) => Promise<{ success: boolean }>
  // 获取窗口锁定状态
  getWinLocked: () => Promise<{ success: boolean; isLocked: boolean }>
  // 监听窗口锁定状态
  onWinLocked: (callback: (isLocked: boolean) => void) => void
  // 退出应用
  quitApp: () => Promise<{ success: boolean }>
  // 获取指定窗口的大小
  getWinSize: (name?: string) => Promise<{ success: boolean; size: [number, number] }>
}

interface AppApi {
  // 获取当前运行平台
  getPlatform: () => Promise<{ success: boolean; platform: string }>
}

interface AutoLaunchApi {
  // 获取开机自启动状态
  getAutoLaunch: () => Promise<{ success: boolean; isAutoLaunch?: boolean; message?: string }>
  // 设置开机自启动
  setAutoLaunch: (isAutoLaunch: boolean) => Promise<{ success: boolean; message?: string }>
}

interface StoreApi {
  // 设置持久化 store 状态
  setStoreWindowStates: (obj: Record<string, unknown>) => Promise<{ success: boolean }>
  // 获取持久化 store 状态
  getStoreWindowStates: (keys?: string | string[]) => Promise<{ success: boolean; data: string | null; message?: string }>
}

interface NotificationApi {
  // 设置系统通知
  setNotification: (notice: {
    title?: string
    subtitle?: string
    body?: string
    icon?: string
    silent?: boolean
    [key: string]: unknown
  }) => Promise<{ success: boolean; message?: string }>
}

interface ElectronAPI {
  // 窗口相关 API, 窗口移动、位置、大小、置顶、锁定、退出、子窗口 
  window: WindowApi
  // 应用相关 API
  app: AppApi
  // 开机自启动相关 API
  autoLaunch: AutoLaunchApi
  // 持久化 store 相关 API
  store: StoreApi
  // 系统通知相关 API
  notification: NotificationApi
}

declare global {
  interface Window {
    electronApi: ElectronAPI
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<null, null, unknown>
  export default component
}

export {}
