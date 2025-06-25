class RuscordSettings {
  constructor() {
    this.settingsKey = 'ruscord-settings';
    this.defaultSettings = {
      openDevTools: false,
      minimizeToTray: false,
      checkUpdatesOnStart: true,
      buttonSize: 'Средний',
      autoClearCache: false,
      updateCheckInterval: 'каждый час',
      enableExtensions: false,
      enableOverlay: false
    };
    this.settings = this.loadSettings();
    this.strings = {};
    this.loadLanguage().then(() => {
      this.injectStyles();
      this.createSettingsButton();
      this.createModal();
    });
  }

  async loadLanguage() {
    try {
      const res = await fetch('./assets/language/ru.json');
      this.strings = await res.json();
    } catch {
      this.strings = {};
    }
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem(this.settingsKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { ...this.defaultSettings };
  }

  saveSettings() {
    localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
  }

  injectStyles() {
    if (document.getElementById('rc-settings-style')) return;
    const style = document.createElement('style');
    style.id = 'rc-settings-style';
    style.textContent = `
      #rc-settings-overlay {
        position: fixed; top:0; left:0; width:100vw; height:100vh;
        background: rgba(0,0,0,0.7);
        display: flex; justify-content: center; align-items: center;
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
      }
      #rc-settings-overlay.show {
        opacity: 1;
        pointer-events: auto;
      }
      #rc-settings-modal {
        background: #121212;
        color: #fff;
        border-radius: 8px;
        padding: 24px;
        width: 480px;
        max-height: 90vh;
        overflow-y: auto;
        font-family: sans-serif;
        box-shadow: 0 0 20px #000;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      #rc-settings-warning {
        background: #3c2a2a;
        border: 1px solid #ff5252;
        padding: 10px;
        border-radius: 4px;
        font-size: 13px;
      }
      #rc-settings-modal h3 {
        margin-top: 20px;
        font-weight: 600;
        font-size: 16px;
        border-bottom: 1px solid #333;
        padding-bottom: 6px;
      }
      .rc-setting-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
      }
      .rc-switch {
        position: relative;
        width: 40px;
        height: 20px;
        background: #555;
        border-radius: 10px;
        cursor: pointer;
        transition: background 0.25s;
        flex-shrink: 0;
      }
      .rc-switch-on {
        background: #3ba55c;
      }
      .rc-switch-handle {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        background: #ccc;
        border-radius: 50%;
        transition: left 0.25s, background 0.25s;
      }
      .rc-switch-on .rc-switch-handle {
        left: 22px;
        background: #fff;
      }
      select.rc-select {
        background: #1e1e1e;
        color: white;
        border: 1px solid #333;
        padding: 6px;
        border-radius: 4px;
        font-size: 14px;
        max-width: 180px;
        cursor: pointer;
      }
      #rc-settings-buttons-row {
        display: flex;
        justify-content: flex-end;
        margin-top: 16px;
        gap: 8px;
      }
      button.rc-btn {
        background: #333;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
      }
      button.rc-btn:hover {
        background: #444;
      }
      #rc-settings-open-btn {
        position: fixed;
        top: 12px;
        right: 72px;
        width: 32px;
        height: 32px;
        background: transparent;
        border: none;
        cursor: pointer;
        z-index: 11000;
      }
      #rc-settings-open-btn img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    `;
    document.head.appendChild(style);
  }

  createSwitch(labelText, settingKey) {
    const row = document.createElement('div');
    row.className = 'rc-setting-row';
    const label = document.createElement('span');
    label.textContent = labelText;
    const outer = document.createElement('div');
    outer.className = 'rc-switch';
    if (this.settings[settingKey]) outer.classList.add('rc-switch-on');
    const handle = document.createElement('div');
    handle.className = 'rc-switch-handle';
    outer.appendChild(handle);
    outer.onclick = () => {
      outer.classList.toggle('rc-switch-on');
      this.settings[settingKey] = outer.classList.contains('rc-switch-on');
      this.saveSettings();
    };
    row.appendChild(label);
    row.appendChild(outer);
    return row;
  }

  createSelect(labelText, settingKey, options) {
    const row = document.createElement('div');
    row.className = 'rc-setting-row';
    row.style.flexDirection = 'column';
    row.style.alignItems = 'flex-start';
    const label = document.createElement('label');
    label.textContent = labelText;
    const select = document.createElement('select');
    select.className = 'rc-select';
    options.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      select.appendChild(o);
    });
    select.value = this.settings[settingKey];
    select.onchange = () => {
      this.settings[settingKey] = select.value;
      this.saveSettings();
    };
    row.appendChild(label);
    row.appendChild(select);
    return row;
  }

  createModal() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'rc-settings-overlay';
    const modal = document.createElement('div');
    modal.id = 'rc-settings-modal';
    const warning = document.createElement('div');
    warning.id = 'rc-settings-warning';
    warning.textContent = this.strings.warning || '';
    modal.appendChild(warning);
    modal.appendChild(this.createSection(this.strings.appSettings));
    modal.appendChild(this.createSwitch(this.strings.openDevTools, 'openDevTools'));
    modal.appendChild(this.createSwitch(this.strings.minimizeToTray, 'minimizeToTray'));
    modal.appendChild(this.createSwitch(this.strings.checkUpdatesOnStart, 'checkUpdatesOnStart'));
    modal.appendChild(this.createSection(this.strings.interface));
    modal.appendChild(this.createSelect(this.strings.buttonSize, 'buttonSize', ['Маленький', 'Средний', 'Большой']));
    modal.appendChild(this.createSection(this.strings.performance));
    modal.appendChild(this.createSwitch(this.strings.autoClearCache, 'autoClearCache'));
    modal.appendChild(this.createSelect(this.strings.updateCheckInterval, 'updateCheckInterval', ['каждый час', 'другое']));
    modal.appendChild(this.createSection(this.strings.extensions));
    modal.appendChild(this.createSwitch(this.strings.enableExtensions, 'enableExtensions'));
    modal.appendChild(this.createSection(this.strings.overlay));
    modal.appendChild(this.createSwitch(this.strings.enableOverlay, 'enableOverlay'));
    const buttons = document.createElement('div');
    buttons.id = 'rc-settings-buttons-row';
    const importBtn = document.createElement('button');
    importBtn.className = 'rc-btn';
    importBtn.textContent = this.strings.import;
    const exportBtn = document.createElement('button');
    exportBtn.className = 'rc-btn';
    exportBtn.textContent = this.strings.export;
    const closeBtn = document.createElement('button');
    closeBtn.className = 'rc-btn';
    closeBtn.textContent = this.strings.close;
    buttons.appendChild(importBtn);
    buttons.appendChild(exportBtn);
    buttons.appendChild(closeBtn);
    modal.appendChild(buttons);
    this.overlay.appendChild(modal);
    document.body.appendChild(this.overlay);
    closeBtn.onclick = () => this.hideModal();
    importBtn.onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,.rcs';
      input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const obj = JSON.parse(reader.result);
            this.settings = { ...this.defaultSettings, ...obj };
            this.saveSettings();
            this.hideModal();
          } catch {}
        };
        reader.readAsText(file);
      };
      input.click();
    };
    exportBtn.onclick = () => {
      const blob = new Blob([JSON.stringify(this.settings, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ruscord-settings.rcs';
      a.click();
      URL.revokeObjectURL(url);
    };
  }

  createSection(title) {
    const h3 = document.createElement('h3');
    h3.textContent = title;
    return h3;
  }

  createSettingsButton() {
    const btn = document.createElement('button');
    btn.id = 'rc-settings-open-btn';
    btn.innerHTML = `<img src="./assets/images/settings.png" alt="Настройки">`;
    btn.onclick = () => this.showModal();
    document.body.appendChild(btn);
  }

  showModal() {
    this.overlay.classList.add('show');
  }

  hideModal() {
    this.overlay.classList.remove('show');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.RuscordSettings = new RuscordSettings();
});
      
