const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Load site Ruscord
  win.loadURL('https://app.russcord.ru');

  // Check update
  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(createWindow);

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Обновление найдено',
    message: 'Скачивается новая версия Ruscord...'
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Обновление готово',
    message: 'Обновление загружено. Перезапустить для установки?',
    buttons: ['Да', 'Позже']
  }).then(result => {
    if (result.response === 0) autoUpdater.quitAndInstall();
  });
});
