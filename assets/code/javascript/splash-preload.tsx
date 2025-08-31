const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  onStatus: (callback) => ipcRenderer.on('splash-status', (event, text) => callback(text)),
  onProgress: (callback) => ipcRenderer.on('splash-progress', (event, downloaded, total, speed) => callback(downloaded, total, speed)),
  send: (channel, ...args) => {
    if (channel === 'cancel-download') {
      ipcRenderer.send(channel, ...args);
    }
  }
});
