import React from 'react'
import TitleBar from './components/TitleBar'
import SettingsPanel from './components/SettingsPanel'

export default function App() {
  return (
    <div className="h-screen bg-[#121212] text-[#a0a0a0]">
      <TitleBar />
      <div className="p-6 overflow-auto">
        <SettingsPanel />
      </div>
    </div>
  )
}
