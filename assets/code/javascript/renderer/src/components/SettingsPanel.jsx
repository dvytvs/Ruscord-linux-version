import React, { useEffect, useState } from 'react'
import Option from './Option'
import DropDown from './DropDown'
import HotkeyButton from './HotkeyButton'

export default function SettingsPanel() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    window.api.getSettings().then(setSettings)
  }, [])

  const update = (key, value) => {
    window.api.setSetting(key, value).then(setSettings)
  }

  if (!settings) return null

  return (
    <div className="space-y-4">
      <div className="bg-[#1e1e1e] rounded p-3">
        <div className="text-[#ff5252] bg-[#3c2a2a] p-2 rounded">
          Это неофициальное приложение сообщества. Не является продуктом Ruscord.
        </div>
      </div>
      <div className="bg-[#1e1e1e] rounded p-3 space-y-2">
        <div className="text-[#a0a0a0] text-sm">НАСТРОЙКИ ПРИЛОЖЕНИЯ</div>
        <Option title="Открывать средства разработчика" desc="Включение этого параметра позволяет открывать средства разработчика через Ctrl + Shift + I" value={settings.devtools} onChange={v => update('devtools', v)} />
        <Option title="Скрывать при закрытии" desc="Включение этого параметра позволяет скрывать Ruscord в трей при нажатии на кнопку закрыть" value={settings.tray} onChange={v => update('tray', v)} />
        <Option title="Проверять обновления" desc="Включение этого параметра позволяет пропускать проверку обновлений при холодном запуске" value={settings.updates} onChange={v => update('updates', v)} />
      </div>
      <div className="bg-[#1e1e1e] rounded p-3 space-y-2">
        <div className="text-[#a0a0a0] text-sm">ИНТЕРФЕЙС</div>
        <DropDown title="Размер кнопок" desc="Настройка размера (Свернуть, Развернуть, Закрыть)" options={['Малый', 'Средний', 'Большой']} value="Средний" />
      </div>
      <div className="bg-[#1e1e1e] rounded p-3 space-y-2">
        <div className="text-[#a0a0a0] text-sm">ПРОИЗВОДИТЕЛЬНОСТЬ</div>
        <Option title="Автоматическая очистка кэша" desc="Очищать кэш при каждом запуске приложения" value={settings.cacheClear} onChange={v => update('cacheClear', v)} />
        <DropDown title="Интервал проверки обновлений" desc="Как часто проверять наличие обновлений" options={['Каждый час', 'Свой интервал']} value="Каждый час" />
      </div>
      <div className="bg-[#1e1e1e] rounded p-3 space-y-2">
        <div className="text-[#a0a0a0] text-sm">РАСШИРЕНИЯ</div>
        <Option title="Включить расширения" desc="Включить поддержку расширений (требуется перезапуск)" value={settings.extensions} onChange={v => update('extensions', v)} />
      </div>
      <div className="bg-[#1e1e1e] rounded p-3 space-y-2">
        <div className="text-[#a0a0a0] text-sm">ИГРОВОЙ ОВЕРЛЕЙ</div>
        <Option title="Включить оверлей" desc="⚠️ Внимание: Функция оверлея находится в стадии разработки и может работать нестабильно. Для управления используйте клавиши F9 (показать/скрыть) и Shift+Tab (режим прозрачности кликов)." value={settings.overlay} onChange={v => update('overlay', v)} />
      </div>
      <div className="bg-[#1e1e1e] rounded p-3 space-y-2">
        <div className="text-[#a0a0a0] text-sm">ГОРЯЧИЕ КЛАВИШИ</div>
        <HotkeyButton text="Ctrl + Shift + U Проверить обновления" />
        <HotkeyButton text="Ctrl + Shift + S Открыть настройки" />
        <HotkeyButton text="Ctrl + Shift + R Перезагрузить окно" />
        <HotkeyButton text="Ctrl + Shift + I Открыть средства разработчика (если включено)" />
      </div>
    </div>
  )
}
