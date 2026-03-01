import { screen } from 'electron'

/**
 * 获取窗口所在的屏幕
 * @param {Electron.BrowserWindow} window
 * @returns {Electron.Display}
 */
export function getCurrentScreen(window) {
  const windowBounds = window.getBounds()
  const point = {
    x: windowBounds.x + windowBounds.width / 2,
    y: windowBounds.y + windowBounds.height / 2,
  }
  return screen.getDisplayNearestPoint(point)
}

/**
 * 物理像素转 CSS 像素
 * @param {number} physicalPixels 物理像素
 * @param {number} [scaleFactor] 缩放比例，缺省为主屏 scaleFactor
 * @returns {number} CSS 像素
 */
export function physicalToCss(physicalPixels, scaleFactor = undefined) {
  const scf = scaleFactor ?? screen.getPrimaryDisplay().scaleFactor
  return physicalPixels / scf
}

/**
 * CSS 像素转物理像素
 * @param {number} cssPixels CSS 像素
 * @param {number} [scaleFactor] 缩放比例
 * @returns {number} 物理像素
 */
export function cssToPhysical(cssPixels, scaleFactor = undefined) {
  const scf = scaleFactor ?? screen.getPrimaryDisplay().scaleFactor
  return cssPixels * scf
}
