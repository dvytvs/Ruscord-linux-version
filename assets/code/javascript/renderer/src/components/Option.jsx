import React from 'react'

export default function Option({ title, desc, value, onChange }) {
  return (
    <div className="bg-[#262626] rounded p-2">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-white">{title}</div>
          <div className="text-xs text-[#98a095]">{desc}</div>
        </div>
        <div
          className={`w-10 h-5 flex items-center rounded-full cursor-pointer ${value ? 'bg-[#7289da]' : 'bg-[#2f2f2f]'}`}
          onClick={() => onChange(!value)}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow transform duration-200 ${value ? 'translate-x-5' : 'translate-x-1'}`}
          ></div>
        </div>
      </div>
    </div>
  )
}
