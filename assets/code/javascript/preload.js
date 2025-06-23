const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  checkInternet: () => ipcRenderer.invoke('check-internet'),
  reloadApp: () => ipcRenderer.invoke('reload-app'),
  controlWindow: (action) => ipcRenderer.send('window-control', action)
})
