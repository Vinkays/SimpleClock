import { describe, it, expect, beforeEach, vi } from 'vitest'

import { onWinLocked, onAppearanceChanged, onUpdatePending } from '../src/utils/event'

describe('Event Utils - IPC Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should export all event listener functions', () => {
    expect(typeof onWinLocked).toBe('function')
    expect(typeof onAppearanceChanged).toBe('function')
    expect(typeof onUpdatePending).toBe('function')
  })

  it('onWinLocked should register event listener', () => {
    const callback = vi.fn()
    const mockApi = window.electronApi.event.onWinLocked as any
    onWinLocked(callback)
    expect(mockApi).toHaveBeenCalledWith(callback)
  })

  it('onAppearanceChanged should register event listener', () => {
    const callback = vi.fn()
    const mockApi = window.electronApi.event.onAppearanceChanged as any
    onAppearanceChanged(callback)
    expect(mockApi).toHaveBeenCalledWith(callback)
  })

  it('onUpdatePending should register event listener', () => {
    const callback = vi.fn()
    const mockApi = window.electronApi.event.onUpdatePending as any
    onUpdatePending(callback)
    expect(mockApi).toHaveBeenCalledWith(callback)
  })
})
