import { app, BrowserWindow, dialog, Menu, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import fs from 'fs/promises';
import log from 'electron-log';
import { fileURLToPath } from 'url';
import Store from 'electron-store';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();

autoUpdater.logger = log;
autoUpdater.autoDownload = true;

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
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  splashWindow.loadFile(path.join(__dirname, 'assets', 'code', 'html', 'splash.html'));
}

function createMain() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets', 'Images', 'winicon.png'),
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.loadURL('https://app.russcord.ru');
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (splashWindow) splashWindow.close();
  });
}

function setupAutoUpdater() {
  autoUpdater.on('update-available', info => {
    splashWindow.webContents.send('update-available', info.version);
  });
  autoUpdater.on('download-progress', progress => {
    splashWindow.webContents.send('update-progress', {
      percent: progress.percent,
      transferred: progress.transferred,
      total: progress.total
    });
  });
  autoUpdater.on('update-downloaded', () => {
    splashWindow.webContents.send('update-downloaded');
    const response = dialog.showMessageBoxSync({
      type: 'question',
      buttons: ['Перезапустить', 'Позже'],
      title: 'Обновление готово',
      message: 'Обновление загружено. Перезапустить приложение сейчас?'
    });
    if (response === 0) autoUpdater.quitAndInstall();
  });
  autoUpdater.on('error', err => {
    splashWindow.webContents.send('update-error', err.message);
  });
  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(() => {
  createSplash();
  setupAutoUpdater();
  setTimeout(() => {
    createMain();
  }, 5000);
});

ipcMain.handle('get-settings', () => store.store);
ipcMain.handle('set-setting', (_, key, value) => {
  store.set(key, value);
});
ipcMain.handle('check-connection', async () => {
  try {
    const res = await fetch('https://app.russcord.ru', { method: 'HEAD', timeout: 3000 });
    return res.ok;
  } catch {
    return false;
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
               
