import { app } from 'electron';
import { createSplash } from './windows/splash.js';
import { checkInternetAndUpdate } from './updater/internetCheck.js';

app.whenReady().then(() => {
  const splash = createSplash();
  checkInternetAndUpdate(splash);
});

app.on('window-all-closed', () => {
  app.quit();
});
