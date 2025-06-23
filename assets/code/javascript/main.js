import { app, BrowserWindow, ipcMain, net } from 'electron';
import path from 'path';
import Store from 'electron-store';

const store = new Store();
let splashWin;
let mainWin;

function createSplashWindow() {
  splashWin = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    resizable: false,
    transparent: false,
    backgroundColor: '#121212',
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  splashWin.loadFile(path.join(__dirname, 'assets', 'code', 'html', 'splash.html'));
}

function createMainWindow() {
  mainWin = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets', 'Images', 'winicon.png'),
    backgroundColor: '#121212',
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWin.loadURL('https://app.russcord.ru');
}

async function checkInternet() {
  return new Promise(resolve => {
    const req = net.request('https://app.russcord.ru');
    req.on('response', () => resolve(true));
    req.on('error', () => resolve(false));
    req.end();
  });
}

app.whenReady().then(() => {
  createSplashWindow();

  (async function waitForConnection() {
    let connected = false;
    while (!connected) {
      connected = await checkInternet();
      splashWin.webContents.send('connection-status', connected);
      if (!connected) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    splashWin.webContents.send('connection-status', true);

    // задержка для визуального эффекта
    setTimeout(() => {
      createMainWindow();
      splashWin.close();
    }, 1000);
  })();
});

ipcMain.handle('check-connection', async () => {
  return await checkInternet();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
