const { app, BrowserWindow, dialog, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');

const store = new Store();

function detectLinuxDistro() {
  try {
    if (process.platform !== 'linux') return null;

    if (fs.existsSync('/etc/debian_version')) {
      return 'deb';
    }
    if (fs.existsSync('/etc/redhat-release')) {
      return 'rpm';
    }
    return 'AppImage';
  } catch {
    return 'AppImage';
  }
}

function logErrorToFile(error) {
  const now = new Date();
  const timestamp = now.toISOString().replace(/:/g, '-'); // Для имени файла
  const logFilename = path.join(app.getPath('userData'), error-${timestamp}.txt);
  const logContent = [${now.toLocaleString()}] Ошибка автообновления:\n${error.stack || error}\n;

  fs.writeFileSync(logFilename, logContent, 'utf-8');

  shell.openPath(logFilename).catch(() => {
    // Если не удалось открыть
  });
}

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
    icon: path.join(__dirname, 'assets', 'winicon.ico'),
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
        { type: 'separator' },
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
        },
        {
          label: 'О программе',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'О Ruscord',
              message: 'Версия: 1.0.0\nАвтор: dvytvs, XZY\n\nОбщайся и играй с друзьями в Ruscord.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  const linuxDistro = detectLinuxDistro();

  autoUpdater.on('error', (error) => {
    logErrorToFile(error);
  });

  autoUpdater.on('update-available', (info) => {
    const asset = info.assets?.find(a => a.name.toLowerCase().includes(linuxDistro));
    if (!asset) {
      dialog.showMessageBox({
        type: 'warning',
        icon: path.join(__dirname, 'assets', 'winicon.png'),
        title: 'Обновление',
        message: Обновление найдено, но подходящий пакет для вашей системы (${linuxDistro}) отсутствует.,
      });
      return;
    }
  dialog.showMessageBox({
      type: 'info',
      icon: path.join(__dirname, 'assets', 'winicon.png'),
      title: 'Обновление найдено',
      message: Скачивается новая версия Ruscord (${asset.name})...
    });
  });

  autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
      type: 'info',
      icon: path.join(__dirname, 'assets', 'winicon.png'),
      title: 'Обновлений нет',
      message: 'Новых обновлений не найдено.'
    });
  });

  autoUpdater.on('download-progress', (progressObj) => {
    const percent = Math.round(progressObj.percent);
    win.setTitle(Ruscord — Загрузка обновления: ${percent}%);
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      icon: path.join(__dirname, 'assets', 'winicon.png'),
      title: 'Обновление готово',
      message: 'Обновление загружено. Перезапустить для установки?',
      buttons: ['Да', 'Позже']
    }).then(result => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      } else {
        win.setTitle('Ruscord');
      }
    });
  });

  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
