import { exec } from 'child_process'
import { promisify } from 'util'
import { app, screen } from 'electron'

const execAsync = promisify(exec)

/**
 * 检查自启动状态
 * @returns {Promise<boolean>}
 */
export async function checkAutoStartFromRegistry() {
  const name = app.getName() || 'SimpleClock'
  try {
    const { stdout } = await execAsync(`reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "${name}"`)
    // 如果命令成功执行且没有报错，说明注册表项存在
    const isEnabled = stdout.includes(name)
    return isEnabled
  } catch (error) {
    // 如果命令执行失败（通常是找不到注册表项），说明自启动未设置
    return false
  }
}

// 添加自启动到注册表
export async function addAutoStartToRegistry() {
  try {
    const path = app.getPath('exe')
    const name = app.getName() || 'SimpleClock'
    await execAsync(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "${name}" /t REG_SZ /d "${path}" /f`);
    return ({ success: true, message: 'success' })
  } catch (error) {
    return ({ success: false, message: error })
  }
}

// 删除注册表中的自启动
export async function removeAutoStartFromRegistry() {
  try {
    const name = app.getName() || 'SimpleClock'
    await execAsync(`reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "${name}" /f`);
    return ({ success: true, message: 'success' })
  } catch (error) {
    return ({ success: false, message: error?.message })
  }
}

// 获取窗口所在的屏幕
export function getCurrentScreen(window) {
  // 获取窗口的边界矩形
  const windowBounds = window.getBounds();
  // 获取窗口中心的坐标点
  const point = { x: windowBounds.x + windowBounds.width / 2, y: windowBounds.y+ windowBounds.height / 2 };
  // 找到包含这个点的屏幕
  const currentScreen = screen.getDisplayNearestPoint(point);
  return currentScreen;
}

/**
 * 物理像素转CSS像素
 * @param {*} physicalPixels 物理像素
 * @param {*} scaleFactor 缩放比例
 * @returns {*} CSS像素
 */
export function physicalToCss(physicalPixels, scaleFactor=undefined) {
  const scf = scaleFactor || screen.getPrimaryDisplay().scaleFactor;
  return physicalPixels / scf;
}

/**
 * css像素转物理像素
 * @param {*} cssPixels css像素
 * @param {*} scaleFactor 缩放比例 
 * @returns {*} 物理像素
 */
export function cssToPhysical(cssPixels, scaleFactor=undefined) {
  const scf = scaleFactor || screen.getPrimaryDisplay().scaleFactor;
  return cssPixels * scf;
}