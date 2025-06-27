import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('splashAPI', {
  onStatus: cb => ipcRenderer.on('splash-status', (_, text) => cb(text)),
  onProgress: cb => ipcRenderer.on('splash-progress', (_, d, t) => cb({ downloaded: d, total: t }))
})
