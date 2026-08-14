
export const {
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
    addNewWindow
} = window.electronApi.window;