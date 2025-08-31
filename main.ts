const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const { showSplash } = require('./assets/code/javascript/splash.js');

let splashWindow;
let mainWindow;

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#121212',
    icon: path.join(__dirname, 'assets', 'winicon.png'),
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL('https://app.russcord.ru');

  mainWindow.once('ready-to-show', () => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
    }
    mainWindow.show();
  });

  const menuTemplate = [
    {
      label: 'Вид',
      submenu: [
        { label: 'Перезагрузить', role: 'reload', accelerator: 'CmdOrCtrl+R' },
        { label: 'Принудительно перезагрузить', role: 'forceReload', accelerator: 'Shift+CmdOrCtrl+R' },
        { type: 'separator' },
        { label: 'Актуальный размер', role: 'resetZoom', accelerator: 'CmdOrCtrl+0' },
        { label: 'Увеличить', role: 'zoomIn', accelerator: 'CmdOrCtrl+Plus' },
        { label: 'Уменьшить', role: 'zoomOut', accelerator: 'CmdOrCtrl+-' },
        { type: 'separator' },
        { label: 'Переключить полноэкранный режим', role: 'togglefullscreen', accelerator: 'F11' },
      ],
    },
    {
      label: 'Помощь',
      submenu: [
        {
          label: 'Связаться с поддержкой',
          accelerator: 'F1',
          click: () => {
            shell.openExternal('https://t.me/supruscord_bot');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(async () => {
  splashWindow = await showSplash();
  await createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
