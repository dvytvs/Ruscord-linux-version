import React, { useState } from 'react'
import TabBar from './components/TabBar'
import SettingsPanel from './components/SettingsPanel'

export default function App() {
  const [activeTab, setActiveTab] = useState('site')

  return (
    <div className="w-full h-full flex flex-col bg-[#121212]">
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1">
        {activeTab === 'site' && (
          <webview
            src="https://app.russcord.ru"
            style={{ width: '100%', height: '100%' }}
            partition="persist:ruscord"
          ></webview>
        )}
        {activeTab === 'settings' && (
          <div className="p-4 bg-[#1e1e1e] rounded">
            <SettingsPanel />
          </div>
        )}
        {activeTab === 'addons' && (
          <div className="p-4 bg-[#1e1e1e] rounded text-white">
            <h2 className="text-lg font-bold mb-2">Дополнения</h2>
            <p className="text-[#98a095]">Функция дополнений находится в разработке. Следите за обновлениями!</p>
          </div>
        )}
      </div>
    </div>
  )
}
