import { autoUpdater } from 'electron-updater';
import { createMainWindow } from '../windows/mainWindow.js';

export function checkForUpdates(splash) {
  autoUpdater.on('checking-for-update', () => {
    splash.webContents.send('status-update', 'Проверка обновлений...');
  });

  autoUpdater.on('update-available', (info) => {
    splash.webContents.send('status-update', `Доступно обновление: ${info.version}`);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    const loaded = Math.round(progressObj.transferred / 1024);
    const total = Math.round(progressObj.total / 1024);
    splash.webContents.send('status-update', `Скачано ${loaded}КБ из ${total}КБ`);
    splash.webContents.send('progress-update', progressObj.percent);
  });

  autoUpdater.on('update-downloaded', () => {
    splash.webContents.send('status-update', 'Установка обновления...');
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on('update-not-available', () => {
    splash.webContents.send('status-update', 'Обновление не найдено');
    setTimeout(() => {
      splash.webContents.send('status-update', 'Запуск Ruscord...');
      setTimeout(() => {
        splash.close();
        createMainWindow();
      }, 500);
    }, 1000);
  });

  autoUpdater.on('error', (err) => {
    splash.webContents.send('status-update', `Ошибка обновления: ${err.message}`);
    setTimeout(() => {
      splash.close();
      createMainWindow();
    }, 2000);
  });

  autoUpdater.checkForUpdatesAndNotify();
}
