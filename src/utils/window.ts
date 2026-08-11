
export const {
    setWinLocked, 
    getWinLocked, 
    setAlwaysOnTop, 
    getAlwaysOnTop,
    quitApp,
    removeWindow,
    beginMove,
    endMove,
    getWindowPosition,
    setWindowPosition,
    getWinSize,
    onWinLocked,
    addNewWindow
} = window.electronApi.window;