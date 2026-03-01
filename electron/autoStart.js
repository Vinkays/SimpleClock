import { exec } from 'child_process'
import { promisify } from 'util'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import os from 'os'

const execAsync = promisify(exec)
// 应用名称
const APP_NAME = app.getName() || 'SimpleClock'

/**
 * 检查自启动状态（仅 Windows 注册表）
 * @returns {Promise<boolean>}
 */
export async function checkAutoStartFromRegistry() {
  if (process.platform !== 'win32') return false
  const name = APP_NAME
  try {
    const { stdout } = await execAsync(
      `reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "${name}"`
    )
    return stdout.includes(name)
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * 获取Linux中开机自启动的桌面文件路径
 * @returns {Object}
 */
function getLinuxAutostartDesktopPath() {
  const configDir = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config')
  const autostartDir = path.join(configDir, 'autostart')
  const appName = (APP_NAME).replace(/\s+/g, '')
  return {
    autostartDir,
    desktopFilePath: path.join(autostartDir, `${appName}.desktop`),
  }
}

/**
 * 在Linux中检查开机自启动
 * @returns {Promise<boolean>}
 */
async function checkLinuxAutoStart() {
  const { desktopFilePath } = getLinuxAutostartDesktopPath()
  return fs.existsSync(desktopFilePath)
}

/**
 * 在Linux中添加开机自启动
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function addLinuxAutoStart() {
  try {
    const { autostartDir, desktopFilePath } = getLinuxAutostartDesktopPath()
    if (!fs.existsSync(autostartDir)) {
      fs.mkdirSync(autostartDir, { recursive: true })
    }
    const appName = APP_NAME
    const desktopContent = [
      '[Desktop Entry]',
      `Name=${appName}`,
      'Type=Application',
      `Exec="${process.execPath}"`,
      'X-GNOME-Autostart-enabled=true',
      'Terminal=false',
    ].join('\n')
    fs.writeFileSync(desktopFilePath, desktopContent, { mode: 0o644 })
    return { success: true, message: 'success' }
  } catch (error) {
    return { success: false, message: error?.message || String(error) }
  }
}

/**
 * 在Linux中移除开机自启动
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function removeLinuxAutoStart() {
  try {
    const { desktopFilePath } = getLinuxAutostartDesktopPath()
    if (fs.existsSync(desktopFilePath)) fs.unlinkSync(desktopFilePath)
    return { success: true, message: 'success' }
  } catch (error) {
    return { success: false, message: error?.message || String(error) }
  }
}

/**
 * 统一查询当前平台自启动状态
 * @returns {Promise<boolean>}
 */
export async function isAutoStartEnabled() {
  const platform = process.platform
  if (platform === 'win32') return checkAutoStartFromRegistry()
  if (platform === 'darwin') return !!app.getLoginItemSettings().openAtLogin
  if (platform === 'linux') return checkLinuxAutoStart()
  return false
}

/**
 * 统一开启当前平台自启动
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function enableAutoStart() {
  const platform = process.platform
  if (platform === 'win32') return addAutoStartToRegistry()
  if (platform === 'darwin') {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: process.execPath,
      args: [],
    })
    return { success: true, message: 'success' }
  }
  if (platform === 'linux') return addLinuxAutoStart()
  return { success: false, message: '当前平台暂不支持自启动配置' }
}

/**
 * 统一关闭当前平台自启动
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function disableAutoStart() {
  const platform = process.platform
  if (platform === 'win32') return removeAutoStartFromRegistry()
  if (platform === 'darwin') {
    app.setLoginItemSettings({ openAtLogin: false })
    return { success: true, message: 'success' }
  }
  if (platform === 'linux') return removeLinuxAutoStart()
  return { success: false, message: '当前平台暂不支持自启动配置' }
}

/**
 * 在注册表添加开机自启动
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function addAutoStartToRegistry() {
  if (process.platform !== 'win32') {
    return { success: false, message: '当前平台不支持注册表自启动配置' }
  }
  try {
    const exePath = app.getPath('exe')
    const name = APP_NAME
    await execAsync(
      `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "${name}" /t REG_SZ /d "${exePath}" /f`
    )
    return { success: true, message: 'success' }
  } catch (error) {
    return { success: false, message: error?.message || String(error) }
  }
}

/**
 * 在注册表移除开机自启动
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function removeAutoStartFromRegistry() {
  if (process.platform !== 'win32') {
    return { success: false, message: '当前平台不支持注册表自启动配置' }
  }
  try {
    const name = APP_NAME
    await execAsync(
      `reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "${name}" /f`
    )
    return { success: true, message: 'success' }
  } catch (error) {
    return { success: false, message: error?.message || String(error) }
  }
}
