import { describe, it, expect, beforeEach, vi } from 'vitest'

import { setNotification } from '../src/utils/notification'

describe('Notification Utils - IPC Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should export setNotification function', () => {
    expect(typeof setNotification).toBe('function')
  })

  it('setNotification should send notification', async () => {
    const mockApi = window.electronApi.notification.setNotification as any
    const notice = {
      title: 'Test Notification',
      body: 'This is a test notification',
    }
    await setNotification(notice)
    expect(mockApi).toHaveBeenCalledWith(notice)
  })

  it('setNotification should handle only title', async () => {
    const mockApi = window.electronApi.notification.setNotification as any
    const notice = { title: 'Simple Notification' }
    await setNotification(notice)
    expect(mockApi).toHaveBeenCalledWith(notice)
  })
})
