const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendReady: () => ipcRenderer.send('splash-ready'),
  onProgressUpdate: (cb) => ipcRenderer.on('progress-update', (event, downloaded, total) => cb(downloaded, total)),
  onStatusUpdate: (cb) => ipcRenderer.on('status-update', (event, text) => cb(text))
});
