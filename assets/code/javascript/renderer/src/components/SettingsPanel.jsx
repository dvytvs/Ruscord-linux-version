import React, { useState } from 'react'

export default function SettingsPanel() {
  const [openDevTools, setOpenDevTools] = useState(false)
  const [hideOnClose, setHideOnClose] = useState(true)
  const [checkUpdatesOnStart, setCheckUpdatesOnStart] = useState(true)
  const [buttonSize, setButtonSize] = useState('medium')
  const [autoClearCache, setAutoClearCache] = useState(false)
  const [updateInterval, setUpdateInterval] = useState('3600')
  const [customInterval, setCustomInterval] = useState('')
  const [enableExtensions, setEnableExtensions] = useState(false)

  return (
    <div style={{color: 'white', fontSize: 14}}>
      <div style={{ backgroundColor: '#262626', padding: 12, borderRadius: 8, marginBottom: 12, color: 'red', fontWeight: 'bold' }}>
        Это неофициальное приложение сообщества. Не является продуктом Ruscord.
      </div>

      <Section title="НАСТРОЙКИ ПРИЛОЖЕНИЯ">
        <ToggleRow
          label="Открывать средства разработчика"
          description="Включение этого параметра позволяет открывать средства разработчика через Ctrl + Shift + I"
          checked={openDevTools}
          onChange={() => setOpenDevTools(!openDevTools)}
        />
        <ToggleRow
          label="Скрывать при закрытии"
          description="Включение этого параметра позволяет скрывать Ruscord в трей при нажатии на кнопку закрыть"
          checked={hideOnClose}
          onChange={() => setHideOnClose(!hideOnClose)}
        />
        <ToggleRow
          label="Проверять обновления"
          description="Включение этого параметра позволяет пропускать проверку обновлений при холодном запуске"
          checked={checkUpdatesOnStart}
          onChange={() => setCheckUpdatesOnStart(!checkUpdatesOnStart)}
        />
      </Section>

      <Section title="ИНТЕРФЕЙС">
        <div style={{ marginBottom: 6, fontWeight: '600', color: '#a0a0a0' }}>Размер кнопок</div>
        <div style={{ marginBottom: 12, color: '#98a095' }}>Настройка размера (Свернуть, Развернуть, Закрыть)</div>
        <select
          value={buttonSize}
          onChange={e => setButtonSize(e.target.value)}
          style={{ backgroundColor: '#262626', color: 'white', borderRadius: 6, padding: '4px 8px', marginBottom: 20, width: 140 }}
        >
          <option value="small">Маленький</option>
          <option value="medium">Средний</option>
          <option value="large">Большой</option>
        </select>
      </Section>

      <Section title="ПРОИЗВОДИТЕЛЬНОСТЬ">
        <ToggleRow
          label="Автоматическая очистка кэша"
          description="Очищать кэш при каждом запуске приложения"
          checked={autoClearCache}
          onChange={() => setAutoClearCache(!autoClearCache)}
        />

        <div style={{ marginTop: 20, marginBottom: 6, fontWeight: '600', color: '#a0a0a0' }}>Интервал проверки обновлений</div>
        <div style={{ marginBottom: 12, color: '#98a095' }}>Как часто проверять наличие обновлений</div>

        <select
          value={updateInterval}
          onChange={e => setUpdateInterval(e.target.value)}
          style={{ backgroundColor: '#262626', color: 'white', borderRadius: 6, padding: '4px 8px', width: 140, marginBottom: 12 }}
        >
          <option value="3600">Каждый час</option>
          <option value="1800">Каждые 30 минут</option>
          <option value="7200">Каждые 2 часа</option>
          <option value="0">Никогда</option>
          <option value="custom">Свое значение</option>
        </select>

        {updateInterval === 'custom' && (
          <input
            type="number"
            min="60"
            max="86400"
            placeholder="Введите в секундах"
            value={customInterval}
            onChange={e => setCustomInterval(e.target.value)}
            style={{ backgroundColor: '#262626', color: 'white', borderRadius: 6, padding: '4px 8px', width: 140 }}
          />
        )}
      </Section>

      <Section title="РАСШИРЕНИЯ">
        <ToggleRow
          label="Включить расширения"
          description="Включить поддержку расширений (требуется перезапуск)"
          checked={enableExtensions}
          onChange={() => setEnableExtensions(!enableExtensions)}
        />
      </Section>

      <Section title="ИГРОВОЙ ОВЕРЛЕЙ">
        <div style={{ backgroundColor: '#262626', padding: 12, borderRadius: 8, color: '#98a095' }}>
          Функция оверлея ещё не доступна, появится позже.
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 30 }}>
      <h3 style={{ color: '#a0a0a0', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>{title}</h3>
      {children}
    </section>
  )
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div style={{ backgroundColor: '#262626', borderRadius: 8, padding: 12, marginBottom: 12 }}>
      <label style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
        <div>
          <div style={{ fontWeight: '600', color: 'white' }}>{label}</div>
          <div style={{ fontSize: 12, color: '#98a095', marginTop: 4 }}>{description}</div>
        </div>
        <div
          onClick={onChange}
          role="switch"
          tabIndex={0}
          aria-checked={checked}
          style={{
            width: 40,
            height: 20,
            backgroundColor: checked ? '#7289da' : '#2f2f2f',
            borderRadius: 20,
            position: 'relative',
            cursor: 'pointer',
            transition: 'background-color 0.25s ease'
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              backgroundColor: 'white',
              borderRadius: '50%',
              position: 'absolute',
              top: 1,
              left: checked ? 20 : 2,
              transition: 'left 0.25s ease'
            }}
          />
        </div>
      </label>
    </div>
  )
}
