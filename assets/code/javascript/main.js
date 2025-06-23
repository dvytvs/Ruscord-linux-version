import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

let splashWindow;
let mainWindow;

async function createSplash() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: false,
    backgroundColor: '#121212',
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'assets', 'code', 'preload.js'),
      contextIsolation: true,
      sandbox: true
    }
  });
  splashWindow.loadFile(path.join(__dirname, 'assets', 'code', 'html', 'splash.html'));
}

async function createMain() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#121212',
    icon: path.join(__dirname, 'assets', 'Images', 'winicon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'assets', 'code', 'preload.js'),
      contextIsolation: true,
      sandbox: true
    }
  });
  mainWindow.loadURL('https://app.russcord.ru');
}

async function checkConnection() {
  try {
    const response = await fetch('https://app.russcord.ru', { method: 'HEAD', timeout: 3000 });
    return response.ok;
  } catch {
    return false;
  }
}

app.whenReady().then(async () => {
  await createSplash();

  let connected = false;
  while (!connected) {
    connected = await checkConnection();
    if (connected) {
      splashWindow.webContents.send('connection-status', true);
    } else {
      splashWindow.webContents.send('connection-status', false);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify();

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
    const choice = dialog.showMessageBoxSync({
      type: 'question',
      buttons: ['Перезапустить', 'Позже'],
      title: 'Обновление',
      message: 'Обновление загружено. Перезапустить сейчас?'
    });
    if (choice === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  autoUpdater.on('error', error => {
    splashWindow.webContents.send('update-error', error.message);
  });

  // Небольшая задержка для финального экрана
  setTimeout(async () => {
    await createMain();
    splashWindow.close();
  }, 1500);
});

ipcMain.handle('check-connection', () => checkConnection());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
