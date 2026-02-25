import { describe, it, expect, vi } from 'vitest'

// mock electron screen & app for utils
vi.mock('electron', () => {
  return {
    app: {
      getName: () => 'SimpleClock',
      getPath: (key: string) => `C:/ProgramFiles/SimpleClock/${key}`,
    },
    screen: {
      getPrimaryDisplay: () => ({ scaleFactor: 2 }),
    },
  }
})

import { physicalToCss, cssToPhysical } from '../electron/utils.js'

describe('utils pixel conversion', () => {
  it('physicalToCss converts by scale factor', () => {
    expect(physicalToCss(200, 2)).toBe(100)
  })

  it('cssToPhysical converts by scale factor', () => {
    expect(cssToPhysical(100, 2)).toBe(200)
  })
})

