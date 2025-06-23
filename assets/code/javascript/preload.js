const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  controlWindow: action => ipcRenderer.send('window-control', action),
  getSettings:    ()     => ipcRenderer.invoke('get-settings'),
  setSetting:     (k, v)  => ipcRenderer.invoke('set-setting', k, v)
});
