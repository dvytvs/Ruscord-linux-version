import React, { useEffect, useState } from 'react'

export default function Splash({ onConnected }) {
  const [status, setStatus] = useState('Проверка подключения...')
  const [attemptSeconds, setAttemptSeconds] = useState(0)
  const [connected, setConnected] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let interval

    function checkConnection() {
      window.api.checkInternet().then(isOnline => {
        if (isOnline) {
          setConnected(true)
          onConnected()
        } else {
          setFailed(true)
          setStatus('Wi-Fi не включен\nВключите его и повторите попытку')
        }
      })
    }

    if (!connected) {
      checkConnection()
      interval = setInterval(() => {
        setAttemptSeconds(s => s + 1)
        window.api.checkInternet().then(isOnline => {
          if (isOnline) {
            setConnected(true)
            onConnected()
          }
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [connected, onConnected])

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', backgroundColor:'#121212', color:'white'}}>
      <div
        style={{
          width: 80,
          height: 80,
          animation: 'pulse 2s infinite ease-in-out',
          marginBottom: 16,
        }}
      >
        <img src="../../../../Images/logo2.png" alt="Ruscord" style={{ width: '100%', height: '100%' }} />
      </div>

      {!connected && !failed && (
        <div style={{ color: '#98a095', textAlign: 'center', marginBottom: 16 }}>
          Попытка подключения {attemptSeconds}s
        </div>
      )}

      {failed && (
        <>
          <div style={{ color: 'red', whiteSpace: 'pre-wrap', textAlign: 'center', marginBottom: 16 }}>
            {status}
          </div>
          <button
            onClick={() => window.api.reloadApp()}
            style={{ backgroundColor: '#6d84d4', padding: '8px 16px', borderRadius: 6, border: 'none', color: 'white', cursor: 'pointer' }}
          >
            Перезагрузить
          </button>
        </>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.85); }
        }
      `}</style>
    </div>
  )
}
