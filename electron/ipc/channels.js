/**
 * IPC Channel 命名约定：领域:动作（domain:action）
 * - 便于搜索、白名单与权限控制
 * - 与 ipc/ 模块划分一致
 */

// app 领域：应用信息与平台
export const APP = {
  // 获取应用版本
  VERSION: 'app:version',
  // 获取应用名称
  NAME: 'app:name',
  // 获取当前运行平台
  PLATFORM: 'app:platform',
}

// window 领域：窗口控制（主窗口与子窗口）
export const WINDOW = {
  // 移动窗口至指定位置
  MOVE: 'window:move',
  // 窗口居中
  CENTER: 'window:center',
  // 获取窗口位置
  GET_POSITION: 'window:get-position',
  // 设置窗口位置
  SET_POSITION: 'window:set-position',
  // 获取窗口大小
  GET_SIZE: 'window:get-size',
  // 设置窗口大小
  SET_SIZE: 'window:set-size',
  // 设置窗口置顶
  SET_ALWAYS_ON_TOP: 'window:set-always-on-top',
  // 获取窗口置顶状态
  GET_ALWAYS_ON_TOP: 'window:get-always-on-top',
  // 设置窗口锁定
  SET_LOCKED: 'window:set-locked',
  // 获取窗口锁定状态
  GET_LOCKED: 'window:get-locked',
  // 退出应用
  QUIT: 'window:quit',
  // 新增窗口
  ADD: 'window:add',
  // 移除窗口
  REMOVE: 'window:remove',
}
// 主进程推送给渲染进程的事件名
export const WINDOW_EVENT = {
  // 窗口锁定状态
  LOCKED: 'window:locked',
}

// autoLaunch 领域：开机自启动
export const AUTOLAUNCH = {
  // 获取开机自启动状态
  GET: 'autoLaunch:get',
  // 设置开机自启动
  SET: 'autoLaunch:set',
}

// store 领域：持久化存储
export const STORE = {
  // 获取持久化存储状态
  GET: 'store:get',
  // 设置持久化存储状态
  SET: 'store:set',
}

// notification 领域：系统通知
export const NOTIFICATION = {
  // 显示系统通知
  SHOW: 'notification:show',
}
