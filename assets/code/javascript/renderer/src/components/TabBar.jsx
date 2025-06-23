import React from 'react'

export default function TabBar({ activeTab, setActiveTab }) {
  return (
    <div className="flex items-center justify-between h-8 bg-[#121212] px-2 select-none">
      <div className="flex items-center gap-1 text-white font-bold">
        <img src="../../../../Images/logo.png" className="h-5 w-5" />
        Ruscord
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('addons')}
          className={`w-6 h-6 rounded ${activeTab === 'addons' ? 'bg-[#2f2f2f]' : ''} hover:bg-[#2f2f2f]`}
          title="Дополнения"
        >
          <img src="../../../../Images/icons/addons.png" className="w-full h-full object-contain" />
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-6 h-6 rounded ${activeTab === 'settings' ? 'bg-[#2f2f2f]' : ''} hover:bg-[#2f2f2f]`}
          title="Настройки"
        >
          <img src="../../../../Images/icons/settings.png" className="w-full h-full object-contain" />
        </button>
        <button onClick={() => window.api.controlWindow('minimize')} className="w-6 h-6 rounded hover:bg-[#2f2f2f]" title="Свернуть" />
        <button onClick={() => window.api.controlWindow('maximize')} className="w-6 h-6 rounded hover:bg-[#2f2f2f]" title="Развернуть" />
        <button onClick={() => window.api.controlWindow('close')} className="w-6 h-6 rounded bg-[#6d84d4] hover:bg-[#7f95e0]" title="Закрыть" />
      </div>
    </div>
  )
}
