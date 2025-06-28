const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  onStatus: callback => ipcRenderer.on('splash-status', (event, text) => callback(text)),
  onProgress: callback => ipcRenderer.on('splash-progress', (event, downloaded, total) => callback(downloaded, total)),
});