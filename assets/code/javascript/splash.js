import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_API_RELEASES = 'https://api.github.com/repos/dvytvs/Ruscord-linux-version/releases/latest';
const DOWNLOAD_DIR = path.join(__dirname, '../../downloads');

const DISTROS = ['deb', 'rpm', 'pacman', 'tar.xz', 'appimage', 'snap'];

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

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;

  if (bytes < 1) {
    const bits = bytes * 8;
    return bits.toFixed(dm) + ' бит';
  }

  const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const index = i >= sizes.length ? sizes.length - 1 : i;

  return parseFloat((bytes / Math.pow(k, index)).toFixed(dm)) + ' ' + sizes[index];
}

export function showSplash() {
  return new Promise(async (resolve, reject) => {
    const preloadPath = path.join(__dirname, 'splash-preload.js');

    const splashWin = new BrowserWindow({
      width: 400,
      height: 300,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      resizable: false,
      webPreferences: {
        preload: preloadPath,
        contextIsolation: true,
        nodeIntegration: false
      }
    });

    splashWin.loadFile(path.join(__dirname, '../html/splash.html'));

    function sendStatus(text) {
      splashWin.webContents.send('status-update', text);
    }
    function sendProgress(downloaded, total) {
      splashWin.webContents.send('progress-update', downloaded, total);
    }

    let seconds = 0;
    sendStatus('Проверка подключения к интернету...');
    while (true) {
      const connected = await checkInternet();
      if (connected) break;
      seconds++;
      sendStatus(`Проверка подключения к интернету... ${seconds} сек`);
      await new Promise(r => setTimeout(r, 1000));
    }

    sendStatus('Проверка обновлений...');

    try {
      const releasesRes = await new Promise((res, rej) => {
        https.get(GITHUB_API_RELEASES, {
          headers: { 'User-Agent': 'Ruscord-Updater', 'Accept': 'application/vnd.github.v3+json' }
        }, (resp) => {
          let data = '';
          resp.on('data', chunk => data += chunk);
          resp.on('end', () => res(JSON.parse(data)));
          resp.on('error', rej);
        }).on('error', rej);
      });

      if (!releasesRes.assets) throw new Error('Нет файлов обновления');

      const distro = detectLinuxDistro();
      const asset = releasesRes.assets.find(a => DISTROS.some(d => a.name.toLowerCase().includes(distro || d)));

      if (!asset) {
        sendStatus('Обновлений нет');
        setTimeout(() => {
          splashWin.webContents.executeJavaScript('window.electronAPI.sendReady()');
        }, 1000);
        return;
      }

      if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
      const destPath = path.join(DOWNLOAD_DIR, asset.name);

      sendStatus(`Скачивание обновления: ${asset.name}`);

      await downloadFile(asset.browser_download_url, destPath, (downloaded, total) => {
        sendProgress(downloaded, total);
        sendStatus(`Скачано ${formatBytes(downloaded)} из ${formatBytes(total)}`);
      });

      sendStatus('Запуск...');
      setTimeout(() => {
        splashWin.webContents.executeJavaScript('window.electronAPI.sendReady()');
      }, 1500);

    } catch (e) {
      sendStatus(`Ошибка обновления: ${e.message}`);
      setTimeout(() => splashWin.close(), 5000);
      reject(e);
    }

    ipcMain.once('splash-ready', () => {
      if (!splashWin.isDestroyed()) splashWin.close();
      resolve();
    });
  });
          }
