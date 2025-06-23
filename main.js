const { app, BrowserWindow, dialog, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');
const log = require('electron-log');

//Предназначен для включения определенных GTK
app.commandLine.appendSwitch('gtk-version', '3');

// Инициализация хранилища с валидацией
const schema = {
  windowState: {
    type: 'object',
    properties: {
      width: { type: 'number', minimum: 800, maximum: 2560 },
      height: { type: 'number', minimum: 600, maximum: 1440 },
      isMaximized: { type: 'boolean' }
    },
    default: {
      width: 1200,
      height: 800,
      isMaximized: false
    }
  }
};

const store = new Store({ schema });

// Конфигурация автообновления
autoUpdater.logger = log;
autoUpdater.autoDownload = true;
autoUpdater.allowPrerelease = false;

// Определение дистрибутива Linux (оптимизированная версия)
function detectLinuxDistro() {
  if (process.platform !== 'linux') return null;

  const distroFiles = [
    { path: '/etc/debian_version', type: 'deb' },
    { path: '/etc/redhat-release', type: 'rpm' },
    { path: '/var/lib/snapd/snap', type: 'snap' },
    { path: '/snap', type: 'snap' }
  ];

  for (const { path: filePath, type } of distroFiles) {
    try {
      if (fs.existsSync(filePath)) return type;
    } catch (err) {
      log.error(`Ошибка проверки файла ${filePath}:`, err);
    }
  }
  return 'AppImage';
}

// Логирование ошибок с ротацией файлов
async function logErrorToFile(error) {
  try {
    const logsDir = app.getPath('logs');
    await fs.mkdir(logsDir, { recursive: true });
    
    const logFile = path.join(logsDir, 'ruscord-error.log');
    const timestamp = new Date().toISOString();
    const logContent = `[${timestamp}] ERROR:\n${error.stack || error}\n\n`;
    
    await fs.appendFile(logFile, logContent);
    log.info('Лог ошибки сохранён:', logFile);
  } catch (err) {
    log.error('Ошибка при логировании:', err);
  }
}

// Создание главного окна с улучшенной обработкой состояния
function createWindow() {
  const windowState = store.get('windowState');
  const iconPath = process.platform === 'win32' 
    ? path.join(__dirname, 'assets', 'winicon.ico')
    : path.join(__dirname, 'assets', 'icon.png');

  const win = new BrowserWindow({
    ...windowState,
    minWidth: 800,
    minHeight: 600,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      enableRemoteModule: false
    },
    show: false
  });

  // Загрузка основного URL с обработкой ошибок
  win.loadURL('https://app.russcord.ru').catch(err => {
    logErrorToFile(err);
    win.loadFile(path.join(__dirname, 'fallback.html'));
  });

  win.once('ready-to-show', () => win.show());

  // Сохранение состояния окна с дебаунсингом
  let saveStateTimeout;
  const saveWindowState = () => {
    clearTimeout(saveStateTimeout);
    saveStateTimeout = setTimeout(() => {
      if (win.isDestroyed()) return;
      
      const bounds = win.getBounds();
      store.set('windowState', {
        width: bounds.width,
        height: bounds.height,
        isMaximized: win.isMaximized()
      });
    }, 500);
  };

  win.on('resize', saveWindowState);
  win.on('move', saveWindowState);
  win.on('maximize', saveWindowState);
  win.on('unmaximize', saveWindowState);

  // Создание меню с улучшенной структурой
  const createMenu = () => {
    const template = [
      {
        label: 'Файл',
        submenu: [
          { role: 'quit' }
        ]
      },
      {
        label: 'Настройки',
        submenu: [
          {
            label: 'Проверить обновления',
            click: () => checkForUpdates(win)
          },
          { type: 'separator' },
          {
            label: 'Открыть папку с логами',
            click: () => shell.openPath(app.getPath('logs'))
          }
        ]
      },
      {
        label: 'Вид',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Помощь',
        submenu: [
          {
            label: 'Поддержка',
            click: () => shell.openExternal('https://t.me/supruscord_bot')
          },
          {
            label: 'О программе',
            click: () => showAboutWindow(win)
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  };

  createMenu();

  // Настройка автообновления
  setupAutoUpdater(win);
}

// Функция для окна "О программе"
function showAboutWindow(parentWindow) {
  const aboutWin = new BrowserWindow({
    width: 600,
    height: 400,
    resizable: false,
    parent: parentWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  aboutWin.loadFile(path.join(__dirname, 'about.html'));
  aboutWin.setMenu(null);

  // Безопасная обработка внешних ссылок
  aboutWin.webContents.on('will-navigate', (e, url) => {
    if (url !== aboutWin.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  });

  aboutWin.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Улучшенная система автообновления
function setupAutoUpdater(win) {
  const linuxDistro = detectLinuxDistro();

  autoUpdater.on('error', (error) => {
    logErrorToFile(error);
    win.webContents.send('update-error', error.message);
  });

  autoUpdater.on('update-available', (info) => {
    const asset = info.assets?.find(a => 
      a.name.toLowerCase().includes(linuxDistro || '')
    );

    if (!asset && process.platform === 'linux') {
      dialog.showMessageBoxSync(win, {
        type: 'warning',
        title: 'Обновление недоступно',
        message: `Для вашего дистрибутива (${linuxDistro}) нет подходящего пакета.`,
        detail: 'Пожалуйста, обновите приложение вручную через сайт.'
      });
      return;
    }

    win.webContents.send('update-started', info.version);
  });

  autoUpdater.on('download-progress', (progress) => {
    win.webContents.send('update-progress', progress.percent);
    win.setProgressBar(progress.percent / 100);
  });

  autoUpdater.on('update-downloaded', () => {
    const response = dialog.showMessageBoxSync(win, {
      type: 'question',
      buttons: ['Перезапустить', 'Позже'],
      title: 'Обновление готово',
      message: 'Обновление загружено. Перезапустить приложение сейчас?',
      cancelId: 1
    });

    if (response === 0) autoUpdater.quitAndInstall();
  });

  // Первоначальная проверка обновлений
  if (!app.isPackaged) {
    autoUpdater.checkForUpdates();
  } else {
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// Инициализация приложения
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Обработка ошибок процесса
process.on('uncaughtException', (error) => {
  logErrorToFile(error);
  dialog.showErrorBox('Критическая ошибка', error.message);
});

// IPC обработчики для безопасной коммуникации
ipcMain.handle('get-app-version', () => app.getVersion());
