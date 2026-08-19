import { describe, it, expect, beforeEach, vi } from 'vitest'

import { setAutoLaunch, getAutoLaunch } from '../src/utils/autoLaunch'

describe('AutoLaunch Utils - IPC Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should export autoLaunch functions', () => {
    expect(typeof setAutoLaunch).toBe('function')
    expect(typeof getAutoLaunch).toBe('function')
  })

  it('setAutoLaunch should enable auto launch', async () => {
    const mockApi = window.electronApi.autoLaunch.setAutoLaunch as any
    await setAutoLaunch(true)
    expect(mockApi).toHaveBeenCalledWith(true)
  })

  it('setAutoLaunch should disable auto launch', async () => {
    const mockApi = window.electronApi.autoLaunch.setAutoLaunch as any
    await setAutoLaunch(false)
    expect(mockApi).toHaveBeenCalledWith(false)
  })

  it('getAutoLaunch should query auto launch status', async () => {
    const mockApi = window.electronApi.autoLaunch.getAutoLaunch as any
    const result = await getAutoLaunch()
    expect(mockApi).toHaveBeenCalled()
    expect(result.isAutoLaunch).toBe(false)
  })
})
