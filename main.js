const { app, BrowserWindow, dialog, Menu, shell } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');

const store = new Store();

function createWindow() {
  const windowState = store.get('windowState', {
    width: 1200,
    height: 800,
    isMaximized: false
  });

  const win = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets', 'winicon.png'), // иконка
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (windowState.isMaximized) {
    win.maximize();
  }

  win.loadURL('https://app.russcord.ru');

  function saveWindowState() {
    if (!win.isDestroyed()) {
      if (!win.isMaximized()) {
        const bounds = win.getBounds();
        store.set('windowState', {
          width: bounds.width,
          height: bounds.height,
          isMaximized: false
        });
      } else {
        store.set('windowState', {
          width: windowState.width,
          height: windowState.height,
          isMaximized: true
        });
      }
    }
  }

  win.on('resize', saveWindowState);
  win.on('move', saveWindowState);
  win.on('maximize', saveWindowState);
  win.on('unmaximize', saveWindowState);

  autoUpdater.checkForUpdatesAndNotify();

  const menuTemplate = [
    {
      label: 'Настройки',
      submenu: [
        {
          label: 'Проверить обновление',
          click: () => {
            autoUpdater.checkForUpdates();
          }
        }
      ]
    },
    {
      label: 'Вид',
      submenu: [
        { label: 'Перезагрузить', role: 'reload' },
        { label: 'Принудительно перезагрузить', role: 'forceReload' },
        { label: 'Актуальный размер', role: 'resetZoom' },
        { label: 'Увеличить', role: 'zoomIn' },
        { label: 'Уменьшить', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Переключить полноэкранный режим', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Помощь',
      submenu: [
        {
          label: 'Связаться с поддержкой',
          click: () => {
            shell.openExternal('https://t.me/supruscord_bot');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Обновление найдено',
    message: 'Скачивается новая версия Ruscord...'
  });
});

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Обновлений нет',
    message: 'Новых обновлений не найдено.'
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Обновление готово',
    message: 'Обновление загружено. Перезапустить для установки?',
    buttons: ['Да', 'Позже']
  }).then(result => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});
