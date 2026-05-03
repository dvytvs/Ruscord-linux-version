const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  getSources: () => ipcRenderer.invoke('get-sources')
});

window.addEventListener('DOMContentLoaded', () => {
  const script = document.createElement('script');
  script.textContent = `
    navigator.mediaDevices.getDisplayMedia = async () => {
      const sources = await window.electronAPI.getSources();
      const target = sources[0];
      return await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: target.id,
            minWidth: 1280,
            maxWidth: 1920,
            minHeight: 720,
            maxHeight: 1080
          }
        }
      });
    };
  `;
  document.documentElement.appendChild(script);
});
