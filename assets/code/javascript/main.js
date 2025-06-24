import { app } from 'electron';
import { createSplash } from './assets/code/javascript/windows/splash.js';
import { checkInternetAndUpdate } from './assets/code/javascript/updater/internetCheck.js';

app.whenReady().then(() => {
  const splash = createSplash();
  checkInternetAndUpdate(splash);
});

app.on('window-all-closed', () => {
  app.quit();
});
