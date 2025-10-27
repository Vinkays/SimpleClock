interface ElectronAPI {
  // 移动窗口至指定位置
  moveWindow: ({x, y}:{x: number, y: number}, animate?: boolean) => Promise<{x?: number, y?: number,success: boolean}>,
  // 设置窗口居中
  centerWindow: () => Promise<{success: boolean}>,
  // 设置窗口位置
  setWindowPosition: (x: number, y: number) => Promise<{success: boolean}>,
  // 获取窗口位置
  getWindowPosition: () => Promise<{x: number, y: number}>,
  // 获取窗口置顶状态
  getAlwaysOnTop: () => Promise<{success: boolean, isTop:boolean}>,
  // 设置窗口置顶
  setAlwaysOnTop: (isTop: boolean, level?: 'pop-up-menu'| 'screen-saver') => Promise<{success: boolean}>
  // 新增窗口
  addNewWindow: (name: string, position?: {x: number, y: number}, size?:[number, number]) => Promise<{success: boolean, message?: string}>,
  // 移除指定窗口
  removeWindow: (name: string) =>Promise<{success: boolean, message?: string}>,
  // 获取窗口锁定状态
  getWinLocked: () => Promise<{success: boolean, isLocked: boolean}>,
  // 设置窗口锁定状态
  setWinLocked: (isLocked: boolean) => Promise<{success: boolean}>,
  // 监听窗口锁定状态
  onWinLocked: (callback: Function) => void,
  // 关闭应用
  quitApp: () => void,
  // 获取开机自启状态
  getAutoLaunch: () => Promise<{success: boolean, isAutoLaunch: boolean}>,
  // 设置开机自启
  setAutoLaunch: (isAutoLaunch: boolean) => Promise<{success: boolean}>,
  // 存储内容
  setStoreWindowStates: (obj: any) => Promise<{success: boolean}>,
  // 获取存储的内容
  getStoreWindowStates: (keys?: string | string[]) => Promise<{success: boolean, data: any, message?: string}>,
  // 获取指定窗口的大小
  getWinSize: (name: string = 'main') => Promise<{success: boolean, size: [number, number]}>,
  // 设置系统通知
  setNotification: (notice:{title?:string,subtitle?:string, body?:string,icon?:string, silent?:boolean, hasReply?:boolean, timeoutType?:string,replyPlaceholder?:string,sound?:string, actions?:any[],closeButtonText?:string,toastXml?:string}) => Promise<{success: boolean, message?: string, data?: any}>,
}
// 扩展 Window 接口
declare global {
  interface Window {
    // Electron 相关 API
    electronApi: ElectronAPI;
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 确保文件作为模块处理
export {};