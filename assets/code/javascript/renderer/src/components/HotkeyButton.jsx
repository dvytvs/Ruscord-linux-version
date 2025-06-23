import React from 'react'

export default function HotkeyButton({ text }) {
  return (
    <div className="bg-[#262626] rounded p-2 flex justify-between items-center">
      <div className="text-white text-sm">{text}</div>
      <button className="bg-[#7289da] text-white rounded px-2 py-1 text-xs hover:bg-[#8094e0]">Выполнить</button>
    </div>
  )
}
