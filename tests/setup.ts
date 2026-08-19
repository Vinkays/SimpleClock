import { vi } from 'vitest'

// Setup global window.electronApi mock for all frontend utils tests
declare global {
  var window: any
}

globalThis.window = {
  electronApi: {
    window: {
      setWinLocked: vi.fn(),
      getWinLocked: vi.fn().mockResolvedValue({ isLocked: false }),
      setAlwaysOnTop: vi.fn(),
      getAlwaysOnTop: vi.fn().mockResolvedValue({ isTop: false }),
      removeWindow: vi.fn(),
      beginMove: vi.fn(),
      endMove: vi.fn(),
      getWindowPosition: vi.fn().mockResolvedValue({ x: 0, y: 0 }),
      setWindowPosition: vi.fn(),
      getWinSize: vi.fn().mockResolvedValue({ size: [350, 100] }),
      addNewWindow: vi.fn(),
    },
    app: {
      quitAndInstall: vi.fn(),
      isUpdatePending: vi.fn().mockResolvedValue(false),
      getPlatform: vi.fn().mockResolvedValue({ success: true, platform: 'win32' }),
      quitApp: vi.fn(),
      setAppearance: vi.fn(),
      getAppearance: vi.fn().mockResolvedValue({
        success: true,
        appearance: { bgColor: '#fff', textColor: '#000' },
      }),
    },
    event: {
      onWinLocked: vi.fn(),
      onAppearanceChanged: vi.fn(),
      onUpdatePending: vi.fn(),
    },
    store: {
      setStoreWindowStates: vi.fn().mockResolvedValue({ success: true }),
      getStoreWindowStates: vi.fn().mockResolvedValue({ success: true, data: {} }),
    },
    notification: {
      setNotification: vi.fn().mockResolvedValue({ success: true }),
    },
    autoLaunch: {
      setAutoLaunch: vi.fn().mockResolvedValue({ success: true }),
      getAutoLaunch: vi.fn().mockResolvedValue({ success: true, isAutoLaunch: false }),
    },
  },
}

