const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');

const store = new Store({
  defaults: {
    settings: {
      devtools: false,
      tray: true,
      updates: true,
      cacheClear: false,
      updateInterval: 3600,
      extensions: false,
      overlay: false
    }
  }
});

let splashWindow;
let mainWindow;

function createSplash() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    hasShadow: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  splashWindow.loadFile(path.join(__dirname, 'assets', 'code', 'html', 'splash.html'));
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#121212',
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'assets', 'code', 'javascript', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'assets', 'code', 'html', 'index.html'));
  ipcMain.on('window-control', (e, action) => {
    if (action === 'minimize') mainWindow.minimize();
    else if (action === 'maximize') mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
    else if (action === 'close') mainWindow.close();
  });
  ipcMain.handle('get-settings', () => store.get('settings'));
  ipcMain.handle('set-setting', (e, key, value) => {
    const s = store.get('settings');
    s[key] = value;
    store.set('settings', s);
    return s;
  });
}

app.whenReady().then(() => {
  createSplash();
  autoUpdater.autoDownload = true;
  autoUpdater.checkForUpdates();
  autoUpdater.on('download-progress', (progress) => {
    splashWindow.webContents.send('update-progress', progress);
  });
  autoUpdater.on('update-downloaded', () => {
    createMainWindow();
    splashWindow.close();
  });
  autoUpdater.on('update-not-available', () => {
    createMainWindow();
    splashWindow.close();
  });
  autoUpdater.on('error', () => {
    createMainWindow();
    splashWindow.close();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
