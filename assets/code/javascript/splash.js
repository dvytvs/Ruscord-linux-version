import { app, BrowserWindow } from 'electron'
import path from 'path'
import fs from 'fs'
import https from 'https'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let updateDownloadReq
let updateDownloadFile
let updateTotal = 0
let updateDownloaded = 0
let checkStartTime = 0

function safeSend(window, channel, ...args) {
  if (window && !window.isDestroyed() && window.webContents && !window.webContents.isDestroyed()) {
    window.webContents.send(channel, ...args)
  }
}

const sendStatus = (window, text) => safeSend(window, 'splash-status', text)
const sendProgress = (window, downloaded, total) => safeSend(window, 'splash-progress', downloaded, total)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function checkInternet() {
  return new Promise(resolve => {
    const req = https.request(
      {
        hostname: 'russcord.ru',
        method: 'HEAD',
        timeout: 3000,
      },
      res => resolve(true)
    )
    req.on('error', () => resolve(false))
    req.on('timeout', () => {
      req.destroy()
      resolve(false)
    })
    req.end()
  })
}

async function waitForInternet(window) {
  sendStatus(window, 'Проверка подключения...')
  checkStartTime = Date.now()
  await sleep(5000)

  while (true) {
    const connected = await checkInternet()
    if (connected) break
    const elapsedSec = Math.floor((Date.now() - checkStartTime) / 1000)
    sendStatus(window, `Проверка подключения... ${elapsedSec} с`)
    await sleep(1000)
  }
}

function getPackageType() {
  try {
    const osRelease = fs.readFileSync('/etc/os-release').toString().toLowerCase()
    if (osRelease.includes('arch')) return 'pacman'
    if (osRelease.includes('ubuntu') || osRelease.includes('debian')) {
      if (fs.existsSync('/usr/bin/snap')) return 'snap'
      return 'deb'
    }
    if (osRelease.includes('fedora') || osRelease.includes('centos') || osRelease.includes('red hat')) return 'rpm'
    return 'tar.xz'
  } catch {
    return 'tar.xz'
  }
}

function formatBytes(bytes) {
  const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПТ']
  let i = 0
  let num = bytes
  while (num >= 1024 && i < units.length - 1) {
    num /= 1024
    i++
  }
  return `${num.toFixed(1)} ${units[i]}`
}

function downloadUpdate(window, url) {
  return new Promise((resolve, reject) => {
    updateDownloaded = 0
    updateTotal = 0

    updateDownloadReq = https.get(url, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP Status ${res.statusCode}`))
        return
      }

      updateTotal = parseInt(res.headers['content-length'] || '0', 10)
      updateDownloadFile = fs.createWriteStream(path.join(app.getPath('userData'), 'update.tmp'))

      res.on('data', chunk => {
        updateDownloaded += chunk.length
        sendProgress(window, updateDownloaded, updateTotal)
      })

      res.pipe(updateDownloadFile)

      updateDownloadFile.on('finish', () => {
        updateDownloadFile.close()
        resolve()
      })

      updateDownloadFile.on('error', err => {
        reject(err)
      })
    })

    updateDownloadReq.on('error', err => {
      reject(err)
    })
  })
}

async function checkForUpdates(window) {
  sendStatus(window, 'Проверка обновления...')
  const packageType = getPackageType()
  let assetName
  switch (packageType) {
    case 'deb': assetName = 'Ruscord.deb'; break
    case 'rpm': assetName = 'Ruscord.rpm'; break
    case 'pacman': assetName = 'Ruscord.pacman'; break
    case 'snap': assetName = 'Ruscord.snap'; break
    case 'tar.xz': assetName = 'Ruscord.tar.xz'; break
    default: assetName = 'Ruscord.tar.xz'
  }

  const updateUrl = `https://github.com/dvytvs/Ruscord-linux-version/releases/latest/download/${assetName}`

  try {
    await downloadUpdate(window, updateUrl)
  } catch {
  }
}

async function showSplash() {
  const splash = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    backgroundColor: '#121212',
    icon: path.join(__dirname, '../../Images/iconnobg.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../preload/splash-preload.js'),
    },
  })

  splash.loadFile(path.join(__dirname, '../html/splash.html'))

  await waitForInternet(splash)
  await checkForUpdates(splash)
  sendStatus(splash, 'Запуск...')

  return splash
}

export { showSplash }