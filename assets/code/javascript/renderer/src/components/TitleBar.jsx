import React from 'react'

export default function TitleBar() {
  return (
    <div className="flex items-center justify-between h-8 bg-[#121212] px-2 select-none">
      <div className="flex items-center gap-1 text-white font-bold">
        <img src="../../../../Images/logo.png" className="h-5 w-5" />
        Ruscord
      </div>
      <div className="flex gap-1">
        <button onClick={() => window.api.controlWindow('minimize')} className="w-6 h-6 rounded bg-[#2f2f2f] hover:bg-[#3a3a3a]" />
        <button onClick={() => window.api.controlWindow('maximize')} className="w-6 h-6 rounded bg-[#2f2f2f] hover:bg-[#3a3a3a]" />
        <button onClick={() => window.api.controlWindow('close')} className="w-6 h-6 rounded bg-[#6d84d4] hover:bg-[#7f95e0]" />
      </div>
    </div>
  )
}
