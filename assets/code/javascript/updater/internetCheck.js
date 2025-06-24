import dns from 'dns';
import { checkForUpdates } from './updateCheck.js';

export function checkInternetAndUpdate(splash) {
  const startTime = Date.now();

  function tryConnect() {
    dns.lookup('google.com', (err) => {
      if (err) {
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        splash.webContents.send('status-update', `Подключение к интернету (${seconds} сек)`);
        setTimeout(tryConnect, 1000);
      } else {
        splash.webContents.send('status-update', 'Проверка обновлений...');
        checkForUpdates(splash);
      }
    });
  }

  tryConnect();
}
