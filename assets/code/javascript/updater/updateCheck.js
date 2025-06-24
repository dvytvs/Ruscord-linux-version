import { autoUpdater } from 'electron-updater';
import { createMainWindow } from '../windows/mainWindow.js';

function formatBytes(bytes) {
  if (bytes === 0) return '0 Байт';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const num = bytes / Math.pow(k, i);
  return `${num.toFixed(2)} ${sizes[i]}`;
}

export function checkForUpdates(splash) {
  autoUpdater.on('checking-for-update', () => {
    splash.webContents.send('status-update', 'Проверка обновлений...');
  });

  autoUpdater.on('update-available', (info) => {
    splash.webContents.send('status-update', `Обновление найдено: версия ${info.version}`);
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

  autoUpdater.on('download-progress', (progressObj) => {
    const downloaded = formatBytes(progressObj.transferred);
    const total = formatBytes(progressObj.total);
    splash.webContents.send('status-update', `Скачано ${downloaded} из ${total}`);
    splash.webContents.send('progress-update', progressObj.percent);
  });

  autoUpdater.on('update-downloaded', () => {
    splash.webContents.send('status-update', 'Установка обновления...');
    autoUpdater.quitAndInstall();
  });

  autoUpdater.checkForUpdatesAndNotify();
}
