// спасибо dvytvs ото со стартом мне тяжело было
import defaults from '../json/defaults.json';

class RuscordSettings {
  constructor() {
    this.settingsKey = 'ruscord-settings';
    this.defaultSettings = defaults;
    this.controlsContainer = document.getElementById('rc-settings-controls');
    this.overlay = document.getElementById('rc-settings-overlay');
    this.warningEl = document.getElementById('rc-settings-warning');
    this.importBtn = document.getElementById('rc-import-btn');
    this.exportBtn = document.getElementById('rc-export-btn');
    this.closeBtn = document.getElementById('rc-close-btn');
    this.openBtn = document.getElementById('rc-settings-open-btn');

    this.init();
  }

  async init() {
    this.settings = this.createProxy(this.loadSettings());
    const lang = await this.loadLanguage();
    this.strings = lang;
    this.applyStrings();
    this.buildControls();
    this.bindButtons();
  }

  createProxy(obj) {
    return new Proxy(obj, {
      set: (target, prop, value) => {
        target[prop] = value;
        this.saveSettings();
        return true;
      }
    });
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem(this.settingsKey);
      return saved ? JSON.parse(saved) : { ...this.defaultSettings };
    } catch {
      return { ...this.defaultSettings };
    }
  }

  saveSettings() {
    localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
  }

  async loadLanguage() {
    try {
      const res = await fetch('../language/ru.json');
      return await res.json();
    } catch {
      return {};
    }
  }

  applyStrings() {
    this.warningEl.textContent = this.strings.warning || '';
    this.importBtn.textContent = this.strings.import;
    this.exportBtn.textContent = this.strings.export;
    this.closeBtn.textContent = this.strings.close;
  }

  buildControls() {
    const sections = [
      { title: this.strings.appSettings, items: [
        { type: 'switch', label: this.strings.openDevTools, key: 'openDevTools' },
        { type: 'switch', label: this.strings.minimizeToTray, key: 'minimizeToTray' },
        { type: 'switch', label: this.strings.checkUpdatesOnStart, key: 'checkUpdatesOnStart' },
      ]},
      { title: this.strings.interface, items: [
        { type: 'select', label: this.strings.buttonSize, key: 'buttonSize', options: ['Маленький','Средний','Большой'] }
      ]},
      { title: this.strings.performance, items: [
        { type: 'switch', label: this.strings.autoClearCache, key: 'autoClearCache' },
        { type: 'select', label: this.strings.updateCheckInterval, key: 'updateCheckInterval', options: ['каждый час','другое'] }
      ]},
      { title: this.strings.extensions, items: [
        { type: 'switch', label: this.strings.enableExtensions, key: 'enableExtensions' }
      ]},
      { title: this.strings.overlay, items: [
        { type: 'switch', label: this.strings.enableOverlay, key: 'enableOverlay' }
      ]}
    ];

    sections.forEach(sec => {
      const tSec = document.getElementById('rc-section-template').content.cloneNode(true);
      tSec.querySelector('.rc-section-title').textContent = sec.title;
      this.controlsContainer.appendChild(tSec);

      sec.items.forEach(cfg => {
        const control = this.createControl(cfg);
        this.controlsContainer.appendChild(control);
      });
    });
  }

  createControl({ type, label, key, options }) {
    const tpl = document.getElementById(`rc-${type}-template`).content.cloneNode(true);
    tpl.querySelector('.rc-label').textContent = label;

    if (type === 'switch') {
      const outer = tpl.querySelector('.rc-switch');
      if (this.settings[key]) outer.classList.add('rc-switch-on');
      outer.addEventListener('click', () => {
        outer.classList.toggle('rc-switch-on');
        this.settings[key] = outer.classList.contains('rc-switch-on');
      });
    } else if (type === 'select') {
      const select = tpl.querySelector('.rc-select');
      options.forEach(opt => {
        const o = document.createElement('option'); o.value = o.textContent = opt;
        select.appendChild(o);
      });
      select.value = this.settings[key];
      select.addEventListener('change', () => this.settings[key] = select.value);
    }

    return tpl;
  }

  bindButtons() {
    this.openBtn.addEventListener('click', () => this.showModal());
    this.overlay.addEventListener('click', e => {
      if (e.target === this.overlay) this.hideModal();
    });
    this.closeBtn.addEventListener('click', () => this.hideModal());

    this.importBtn.addEventListener('click', () => this.importSettings());
    this.exportBtn.addEventListener('click', () => this.exportSettings());
  }

  showModal() {
    this.overlay.classList.add('show');
  }

  hideModal() {
    this.overlay.classList.remove('show');
  }

  importSettings() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json,.rcs';
    input.onchange = e => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const obj = JSON.parse(reader.result);
          Object.keys(obj).forEach(k => {
            if (!(k in this.defaultSettings)) throw new Error('Unexpected key: ' + k);
          });
          Object.assign(this.settings, obj);
          this.hideModal();
        } catch {
          alert(this.strings.invalidSettingsFile);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  exportSettings() {
    const blob = new Blob([JSON.stringify(this.settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ruscord-settings.rcs';
    a.click();
    URL.revokeObjectURL(url);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new RuscordSettings();
});
