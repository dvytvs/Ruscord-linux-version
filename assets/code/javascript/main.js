const { app, BrowserWindow, ipcMain, net } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    backgroundColor: '#121212',
    icon: path.join(__dirname, 'assets', 'Images', 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    }
  })

  mainWindow.loadFile(path.join(__dirname, 'assets', 'code', 'javascript', 'renderer', 'index.html'))
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('check-internet', () => {
  return new Promise(resolve => {
    const request = net.request('https://www.google.com')
    request.on('response', () => resolve(true))
    request.on('error', () => resolve(false))
    request.end()
  })
})

ipcMain.handle('reload-app', () => {
  app.relaunch()
  app.exit()
})

ipcMain.on('window-control', (event, action) => {
  const win = BrowserWindow.getFocusedWindow()
  if (!win) return
  switch (action) {
    case 'minimize':
      win.minimize()
      break
    case 'maximize':
      win.isMaximized() ? win.unmaximize() : win.maximize()
      break
    case 'close':
      win.close()
      break
  }
})
