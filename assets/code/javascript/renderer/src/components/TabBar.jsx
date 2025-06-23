import React from 'react'

export default function TabBar({ activeTab, setActiveTab }) {
  const tabStyle = (tab) => ({
    cursor: 'pointer',
    padding: '10px 15px',
    color: activeTab === tab ? 'white' : '#888',
    backgroundColor: '#121212',
    borderBottom: activeTab === tab ? '2px solid #7289da' : '2px solid transparent',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  })

  return (
    <div style={{ display: 'flex', backgroundColor: '#121212', borderBottom: '1px solid #262626' }}>
      <div style={tabStyle('site')} onClick={() => setActiveTab('site')}>
        <img src="../../../../Images/home-icon.png" alt="Site" style={{width: 18, height: 18}} />
      </div>
      <div style={tabStyle('settings')} onClick={() => setActiveTab('settings')}>
        <img src="../../../../Images/settings" alt="Settings" style={{width: 18, height: 18}} />
      </div>
      <div style={tabStyle('addons')} onClick={() => setActiveTab('addons')}>
        <img src="../../../../Images/addons.png" alt="Addons" style={{width: 18, height: 18}} />
      </div>
    </div>
  )
}
