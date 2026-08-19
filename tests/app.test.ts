import { describe, it, expect, beforeEach, vi } from 'vitest'

import {
  quitAndInstall,
  isUpdatePending,
  getPlatform,
  quitApp,
  setAppearance,
  getAppearance,
} from '../src/utils/app'

describe('App Utils - IPC Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should export all app control functions', () => {
    expect(typeof quitAndInstall).toBe('function')
    expect(typeof isUpdatePending).toBe('function')
    expect(typeof getPlatform).toBe('function')
    expect(typeof quitApp).toBe('function')
    expect(typeof setAppearance).toBe('function')
    expect(typeof getAppearance).toBe('function')
  })

  it('quitAndInstall should call electronApi.app.quitAndInstall', async () => {
    const mockApi = window.electronApi.app.quitAndInstall as any
    await quitAndInstall()
    expect(mockApi).toHaveBeenCalled()
  })

  it('isUpdatePending should call electronApi.app.isUpdatePending', async () => {
    const mockApi = window.electronApi.app.isUpdatePending as any
    const result = await isUpdatePending()
    expect(mockApi).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('getPlatform should call electronApi.app.getPlatform', async () => {
    const mockApi = window.electronApi.app.getPlatform as any
    const result = await getPlatform()
    expect(mockApi).toHaveBeenCalled()
    expect(result.platform).toBe('win32')
  })

  it('quitApp should call electronApi.app.quitApp', async () => {
    const mockApi = window.electronApi.app.quitApp as any
    await quitApp()
    expect(mockApi).toHaveBeenCalled()
  })

  it('setAppearance should call electronApi.app.setAppearance', async () => {
    const mockApi = window.electronApi.app.setAppearance as any
    mockApi.mockResolvedValueOnce({ success: true })
    const appearance = { bgColor: '#000', textColor: '#fff' }
    await setAppearance(appearance)
    expect(mockApi).toHaveBeenCalledWith(appearance)
  })

  it('getAppearance should call electronApi.app.getAppearance', async () => {
    const mockApi = window.electronApi.app.getAppearance as any
    const result = await getAppearance()
    expect(mockApi).toHaveBeenCalled()
    expect(result.appearance.bgColor).toBe('#fff')
  })
})
