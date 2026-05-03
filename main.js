const { app, BrowserWindow, desktopCapturer, ipcMain } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('enable-features', 'WebRTCPipeWireCapturer,UseOzonePlatform');
app.commandLine.appendSwitch('ozone-platform-hint', 'auto');
app.commandLine.appendSwitch('enable-media-stream');
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('allow-http-screen-capture');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'build', 'icons', 'linux', 'icon.png'),
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  win.loadURL('https://app.russcord.ru');

  win.webContents.session.setPermissionCheckHandler(() => true);
  win.webContents.session.setPermissionRequestHandler((wc, perm, cb) => cb(true));

  ipcMain.handle('get-sources', async () => {
    return await desktopCapturer.getSources({ types: ['window', 'screen'] });
  });

  ipcMain.on('window-minimize', () => win.minimize());
  ipcMain.on('window-maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  ipcMain.on('window-close', () => win.close());

  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(`
      html {
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
      }
      body {
        height: calc(100% - 32px) !important;
        margin-top: 32px !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        position: relative !important;
      }
      #custom-titlebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 32px;
        background: #1e1e1e;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        z-index: 999999;
        -webkit-app-region: drag;
      }
      .titlebar-button {
        width: 45px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        -webkit-app-region: no-drag;
        transition: 0.1s;
        color: #cccccc;
        font-family: "Segoe UI", sans-serif;
        font-size: 16px;
        user-select: none;
      }
      .titlebar-button:hover { background: rgba(255, 255, 255, 0.1); color: white; }
      #close-btn:hover { background: #e81123 !important; color: white !important; }
    `);

    win.webContents.executeJavaScript(`
      (() => {
        if (document.getElementById('custom-titlebar')) return;
        const div = document.createElement('div');
        div.id = 'custom-titlebar';
        div.innerHTML = \`
          <div class="titlebar-button" id="min-btn">&ndash;</div>
          <div class="titlebar-button" id="max-btn">&#9723;</div>
          <div class="titlebar-button" id="close-btn">&times;</div>
        \`;
        document.documentElement.appendChild(div);

        document.getElementById('min-btn').onclick = () => window.electronAPI.minimize();
        document.getElementById('max-btn').onclick = () => window.electronAPI.maximize();
        document.getElementById('close-btn').onclick = () => window.electronAPI.close();
      })();
    `);
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
