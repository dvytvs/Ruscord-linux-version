import { BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createSplash() {
  const splash = new BrowserWindow({
    width: 300,
    height: 400,
    resizable: false,
    frame: false,
    alwaysOnTop: true,
    backgroundColor: '#121212',
    webPreferences: {
      preload: path.join(__dirname, '../../preload/splash-preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  splash.loadFile('assets/HTML/splash.html');
  return splash;
}
