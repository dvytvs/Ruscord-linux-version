import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GITHUB_API_RELEASES = 'https://api.github.com/repos/dvytvs/Ruscord-linux-version/releases/latest';

const FORMATS = ['deb', 'rpm', 'pacman', 'tar.xz', 'appimage', 'snap'];

function detectLinuxDistro() {
  if (process.platform !== 'linux') return null;
  if (fs.existsSync('/etc/debian_version')) return 'deb';
  if (fs.existsSync('/etc/redhat-release')) return 'rpm';
  if (fs.existsSync('/etc/arch-release')) return 'pacman';
  return 'appimage';
}

function checkInternet() {
  return new Promise((resolve) => {
    https.get('https://russcord.ru', res => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

function downloadFile(url, dest, onProgress) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    let receivedBytes = 0;
    https.get(url, { headers: { 'User-Agent': 'Ruscord-Updater' } }, (res) => {
      const totalBytes = parseInt(res.headers['content-length'], 10);
      res.on('data', chunk => {
        receivedBytes += chunk.length;
        if (onProgress && totalBytes) {
          onProgress(receivedBytes, totalBytes);
        }
      });
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function showSplash() {
  return new Promise(async (resolve, reject) => {
    const splashWin = new BrowserWindow({
      width: 400,
      height: 300,
      frame: false,
      resizable: false,
      transparent: true,
      alwaysOnTop: true,
      webPreferences: {
        preload: path.join(__dirname, 'splash-preload.js'),
        contextIsolation: true
      }
    });

    splashWin.loadFile(path.join(__dirname, '../html/splash.html'));

    const sendStatus = (text) => splashWin.webContents.send('status-update', text);
    const sendProgress = (downloaded, total) => splashWin.webContents.send('progress-update', downloaded, total);

    sendStatus('Проверка подключения к интернету...');
    const internetOk = await checkInternet();

    if (!internetOk) {
      let seconds = 0;
      const interval = setInterval(() => {
        seconds += 1;
        sendStatus(`Проверка подключения к интернету... ${seconds} сек`);
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        splashWin.close();
        reject(new Error('Нет подключения к интернету'));
      }, 6000);
      return;
    }

    sendStatus('Проверка обновлений...');

    try {
      const release = await new Promise((res, rej) => {
        https.get(GITHUB_API_RELEASES, {
          headers: { 'User-Agent': 'Ruscord-Updater' }
        }, (resp) => {
          let data = '';
          resp.on('data', chunk => data += chunk);
          resp.on('end', () => res(JSON.parse(data)));
          resp.on('error', rej);
        }).on('error', rej);
      });

      const linuxDistro = detectLinuxDistro();
      const asset = release.assets.find(a => {
        const name = a.name.toLowerCase();
        return FORMATS.some(f => name.includes(f)) && name.includes(linuxDistro);
      });

      if (!asset) {
        sendStatus('Обновлений нет. Запуск...');
        setTimeout(() => {
          splashWin.close();
          resolve();
        }, 1000);
        return;
      }

      const destPath = path.join(__dirname, '../../downloads', asset.name);
      if (!fs.existsSync(path.dirname(destPath))) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
      }

      sendStatus(`Скачивание обновления: ${asset.name}`);
      await downloadFile(asset.browser_download_url, destPath, (downloaded, total) => {
        sendProgress(downloaded, total);
        sendStatus(`Скачано ${formatBytes(downloaded)} из ${formatBytes(total)}`);
      });

      sendStatus('Запуск...');
      setTimeout(() => {
        splashWin.close();
        resolve();
      }, 1000);

    } catch (e) {
      sendStatus(`Ошибка: ${e.message}`);
      setTimeout(() => {
        splashWin.close();
        reject(e);
      }, 3000);
    }
  });
        }
