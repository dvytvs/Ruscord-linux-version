const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onStatusUpdate: (callback) => ipcRenderer.on('status-update', (event, data) => callback(data)),
  onProgressUpdate: (callback) => ipcRenderer.on('progress-update', (event, data) => callback(data))
});
