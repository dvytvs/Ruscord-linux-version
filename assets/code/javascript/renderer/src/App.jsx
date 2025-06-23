import React, { useState } from 'react'
import Splash from './components/Splash'
import SettingsPanel from './components/SettingsPanel'
import TabBar from './components/TabBar'

export default function App() {
  const [connected, setConnected] = useState(false)
  const [activeTab, setActiveTab] = useState('site')

  if (!connected) {
    return <Splash onConnected={() => setConnected(true)} />
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#121212' }}>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ flexGrow: 1, position: 'relative' }}>
        {activeTab === 'site' && (
          <webview
            src="https://app.russcord.ru"
            style={{ width: '100%', height: '100%' }}
            partition="persist:ruscord"
          />
        )}
        {activeTab === 'settings' && (
          <div style={{ padding: 16 }}>
            <SettingsPanel />
          </div>
        )}
        {activeTab === 'addons' && (
          <div style={{ padding: 16, color: 'white' }}>
            <h2>Дополнения</h2>
            <p>Функция дополнений находится в разработке. Следите за обновлениями!</p>
          </div>
        )}
      </div>
    </div>
  )
}
