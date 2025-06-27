import { BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import fs from 'fs'

function getPackageExtension() {
  if (process.env.SNAP) return 'snap'
  if (process.platform === 'linux') {
    try {
      const osRelease = fs.readFileSync('/etc/os-release').toString().toLowerCase()
      if (osRelease.includes('arch')) return 'pacman'
      if (osRelease.includes('fedora') || osRelease.includes('centos') || osRelease.includes('red hat')) return 'rpm'
      if (osRelease.includes('debian') || osRelease.includes('ubuntu')) return 'deb'
    } catch {}
    return 'tar.xz'
  }
  if (process.platform === 'win32') return 'exe'
  if (process.platform === 'darwin') return 'dmg'
  return 'tar.xz'
}

export function showSplash() {
  return new Promise((resolve, reject) => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const splash = new BrowserWindow({
      width: 300,
      height: 400,
      frame: false,
      transparent: false,
      backgroundColor: '#121212',
      resizable: false,
      alwaysOnTop: true,
      webPreferences: {
        preload: path.join(__dirname, 'splash-preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    })
    splash.center()
    splash.loadFile(path.join(__dirname, '../html/splash.html'))
    const sendStatus = text => splash.webContents.send('splash-status', text)
    const sendProgress = (downloaded, total) => splash.webContents.send('splash-progress', downloaded, total)
    sendStatus('Проверка подключения...')
    let startCountTime = null
    const pingUrl = 'https://russcord.ru'
    const pingInterval = setInterval(async () => {
      try {
        await fetch(pingUrl, { method: 'HEAD' })
        clearInterval(pingInterval)
        checkUpdates()
      } catch {
        if (!startCountTime) {
          setTimeout(() => {
            startCountTime = Date.now()
          }, 5000)
        }
        if (startCountTime) {
          const seconds = Math.floor((Date.now() - startCountTime) / 1000)
          sendStatus(`Проверка подключения... ${seconds}s`)
        }
      }
    }, 1000)
    async function checkUpdates() {
      sendStatus('Проверка обновления...')
      try {
        const res = await fetch(
          'https://api.github.com/repos/dvytvs/Ruscord-linux-version/releases/latest',
          { headers: { 'User-Agent': 'Ruscord-Updater' } }
        )
        const release = await res.json()
        const ext = getPackageExtension()
        let asset = release.assets.find(a => a.name.toLowerCase().endsWith(ext.toLowerCase()))
        if (!asset) {
          const exts = ['deb', 'appimage', 'snap', 'tar.xz', 'rpm', 'pacman']
          asset = release.assets.find(a => exts.some(e => a.name.toLowerCase().endsWith(e)))
        }
        if (asset) {
          await downloadAsset(asset.browser_download_url, asset.size)
        }
      } catch {}
      sendStatus('Запуск...')
      setTimeout(() => {
        splash.close()
        resolve()
      }, 500)
    }
    function downloadAsset(url, totalSize) {
      return new Promise((res, rej) => {
        let downloaded = 0
        https.get(url, response => {
          response.on('data', chunk => {
            downloaded += chunk.length
            sendStatus(`Скачано ${downloaded} из ${totalSize}`)
            sendProgress(downloaded, totalSize)
          })
          response.on('end', () => res())
          response.on('error', rej)
        }).on('error', rej)
      })
    }
    splash.webContents.on('did-fail-load', () => reject())
  })
      }
