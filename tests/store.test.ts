import { describe, it, expect, beforeEach, vi } from 'vitest'

import { setStoreWindowStates } from '../src/utils/store'

describe('Store Utils - IPC Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should export setStoreWindowStates function', () => {
    expect(typeof setStoreWindowStates).toBe('function')
  })

  it('setStoreWindowStates should save window states', async () => {
    const mockApi = window.electronApi.store.setStoreWindowStates as any
    const states = {
      windowSize: [350, 100],
      windowPosition: { x: 100, y: 100 },
    }
    await setStoreWindowStates(states)
    expect(mockApi).toHaveBeenCalledWith(states)
  })

  it('setStoreWindowStates should handle empty object', async () => {
    const mockApi = window.electronApi.store.setStoreWindowStates as any
    await setStoreWindowStates({})
    expect(mockApi).toHaveBeenCalledWith({})
  })
})
