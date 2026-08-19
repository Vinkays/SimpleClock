import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  setWinLocked,
  getWinLocked,
  setAlwaysOnTop,
  getAlwaysOnTop,
  removeWindow,
  beginMove,
  endMove,
  getWindowPosition,
  setWindowPosition,
  getWinSize,
  addNewWindow,
} from '../src/utils/window'

describe('Window Utils - IPC Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should export all window control functions', () => {
    expect(typeof setWinLocked).toBe('function')
    expect(typeof getWinLocked).toBe('function')
    expect(typeof setAlwaysOnTop).toBe('function')
    expect(typeof getAlwaysOnTop).toBe('function')
    expect(typeof removeWindow).toBe('function')
    expect(typeof beginMove).toBe('function')
    expect(typeof endMove).toBe('function')
    expect(typeof getWindowPosition).toBe('function')
    expect(typeof setWindowPosition).toBe('function')
    expect(typeof getWinSize).toBe('function')
    expect(typeof addNewWindow).toBe('function')
  })

  it('setWinLocked should call electronApi.window.setWinLocked', async () => {
    const mockApi = window.electronApi.window.setWinLocked as any
    mockApi.mockResolvedValueOnce({ success: true })
    await setWinLocked(true)
    expect(mockApi).toHaveBeenCalledWith(true)
  })

  it('getWinLocked should call electronApi.window.getWinLocked', async () => {
    const mockApi = window.electronApi.window.getWinLocked as any
    await getWinLocked()
    expect(mockApi).toHaveBeenCalled()
  })

  it('setAlwaysOnTop should call electronApi.window.setAlwaysOnTop', async () => {
    const mockApi = window.electronApi.window.setAlwaysOnTop as any
    mockApi.mockResolvedValueOnce({ success: true })
    await setAlwaysOnTop(true, 'screen-saver')
    expect(mockApi).toHaveBeenCalledWith(true, 'screen-saver')
  })

  it('getAlwaysOnTop should call electronApi.window.getAlwaysOnTop', async () => {
    const mockApi = window.electronApi.window.getAlwaysOnTop as any
    await getAlwaysOnTop()
    expect(mockApi).toHaveBeenCalled()
  })

  it('removeWindow should call electronApi.window.removeWindow', async () => {
    const mockApi = window.electronApi.window.removeWindow as any
    mockApi.mockResolvedValueOnce({ success: true })
    await removeWindow('rightMenus')
    expect(mockApi).toHaveBeenCalledWith('rightMenus')
  })

  it('getWindowPosition should call electronApi.window.getWindowPosition', async () => {
    const mockApi = window.electronApi.window.getWindowPosition as any
    await getWindowPosition()
    expect(mockApi).toHaveBeenCalled()
  })

  it('setWindowPosition should call electronApi.window.setWindowPosition', async () => {
    const mockApi = window.electronApi.window.setWindowPosition as any
    mockApi.mockResolvedValueOnce({ success: true })
    await setWindowPosition(100, 200)
    expect(mockApi).toHaveBeenCalledWith(100, 200)
  })

  it('getWinSize should call electronApi.window.getWinSize', async () => {
    const mockApi = window.electronApi.window.getWinSize as any
    await getWinSize()
    expect(mockApi).toHaveBeenCalled()
  })

  it('addNewWindow should call electronApi.window.addNewWindow', async () => {
    const mockApi = window.electronApi.window.addNewWindow as any
    mockApi.mockResolvedValueOnce({ success: true })
    await addNewWindow('testWindow', { x: 100, y: 200 })
    expect(mockApi).toHaveBeenCalledWith('testWindow', { x: 100, y: 200 })
  })

  it('beginMove should call electronApi.window.beginMove', async () => {
    const mockApi = window.electronApi.window.beginMove as any
    await beginMove()
    expect(mockApi).toHaveBeenCalled()
  })

  it('endMove should call electronApi.window.endMove', async () => {
    const mockApi = window.electronApi.window.endMove as any
    await endMove()
    expect(mockApi).toHaveBeenCalled()
  })
})
