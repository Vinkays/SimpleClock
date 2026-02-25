import { describe, it, expect, vi } from 'vitest'

// mock electron app for storage
vi.mock('electron', () => {
  const basePath = 'C:/tmp/simple-clock-test'
  const paths: Record<string, string> = {
    appData: basePath,
    userData: basePath,
    userCache: basePath,
  }
  return {
    app: {
      getPath: (key: string) => paths[key] || basePath,
      setPath: (key: string, value: string) => {
        paths[key] = value
      },
    },
  }
})

import SimpleStore from '../electron/storage.js'

describe('SimpleStore', () => {
  const filename = 'test-config.json'

  it('should set and get values correctly', () => {
    const store = new SimpleStore(filename)
    // 确保每次测试前是干净的数据
    store.clear()
    store.set('foo', 'bar')
    expect(store.get('foo')).toBe('bar')
  })

  it('should support nested keys and has()', () => {
    const store = new SimpleStore(filename)
    store.clear()
    store.set('a.b.c', 123)
    expect(store.get('a.b.c')).toBe(123)
    expect(store.has('a.b.c')).toBe(true)
    expect(store.has('a.x.y')).toBe(false)
  })
})
