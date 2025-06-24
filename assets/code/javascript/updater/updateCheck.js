import { autoUpdater } from 'electron-updater';
import { createMainWindow } from '../windows/mainWindow.js';

export function checkForUpdates(splash) {
  autoUpdater.on('download-progress', (progressObj) => {
    splash.webContents.send('status-update',
      `Скачано ${Math.round(progressObj.transferred / 1024)}КБ из ${Math.round(progressObj.total / 1024)}КБ`);
    splash.webContents.send('progress-update', progressObj.percent);
  });

  autoUpdater.on('update-downloaded', () => {
    splash.webContents.send('status-update', 'Установка обновления...');
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on('update-not-available', () => {
    splash.webContents.send('status-update', 'Запуск...');
    setTimeout(() => {
      splash.close();
      createMainWindow();
    }, 1000);
  });

  autoUpdater.checkForUpdatesAndNotify();
}
