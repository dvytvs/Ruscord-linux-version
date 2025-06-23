import React, { useState } from 'react'

export default function DropDown({ title, desc, options, value }) {
  const [current, setCurrent] = useState(value)
  const [custom, setCustom] = useState('')
  return (
    <div className="bg-[#262626] rounded p-2">
      <div className="text-white">{title}</div>
      <div className="text-xs text-[#98a095]">{desc}</div>
      <select
        className="mt-1 bg-[#2f2f2f] text-white rounded p-1"
        value={current}
        onChange={e => setCurrent(e.target.value)}
      >
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
      {current === 'Свой интервал' && (
        <input
          type="number"
          placeholder="Секунды"
          className="mt-1 bg-[#2f2f2f] text-white rounded p-1 w-full"
          value={custom}
          onChange={e => setCustom(e.target.value)}
        />
      )}
    </div>
  )
}
