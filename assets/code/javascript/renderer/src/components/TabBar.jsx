import React from 'react'

export default function TabBar({ activeTab, setActiveTab }) {
  return (
    <div className="flex items-center justify-between h-8 bg-[#121212] px-2 select-none">
      <div className="flex items-center gap-1 text-white font-bold">
        <img src="../../../../Images/logo.png" className="h-5 w-5" />
        Ruscord
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => setActiveTab('site')}
          className={`w-6 h-6 rounded ${activeTab === 'site' ? 'bg-[#2f2f2f]' : 'bg-transparent'} hover:bg-[#2f2f2f]`}
          title="Клиент"
        >🌐</button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-6 h-6 rounded ${activeTab === 'settings' ? 'bg-[#2f2f2f]' : 'bg-transparent'} hover:bg-[#2f2f2f]`}
          title="Настройки"
        >⚙</button>
        <button
          onClick={() => setActiveTab('addons')}
          className={`w-6 h-6 rounded ${activeTab === 'addons' ? 'bg-[#2f2f2f]' : 'bg-transparent'} hover:bg-[#2f2f2f]`}
          title="Дополнения"
        >🧩</button>
        <button onClick={() => window.api.controlWindow('minimize')} className="w-6 h-6 rounded hover:bg-[#2f2f2f]" />
        <button onClick={() => window.api.controlWindow('maximize')} className="w-6 h-6 rounded hover:bg-[#2f2f2f]" />
        <button onClick={() => window.api.controlWindow('close')} className="w-6 h-6 rounded bg-[#6d84d4] hover:bg-[#7f95e0]" />
      </div>
    </div>
  )
}
