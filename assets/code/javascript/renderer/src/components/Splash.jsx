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
    <div className="flex flex-col items-center justify-center h-full bg-[#121212] text-white">
      <div
        className="mb-4"
        style={{
          width: 80,
          height: 80,
          animation: 'pulse 2s infinite ease-in-out',
        }}
      >
        <img src="../../../../Images/logo.png" alt="Ruscord" style={{ width: '100%', height: '100%' }} />
      </div>

      {!connected && !failed && (
        <div className="text-center text-[#98a095] mb-2">
          Попытка подключения {attemptSeconds}s
        </div>
      )}

      {failed && (
        <>
          <div className="text-center text-red-600 whitespace-pre-wrap mb-4">{status}</div>
          <button
            onClick={() => window.api.reloadApp()}
            className="bg-[#6d84d4] px-4 py-2 rounded hover:bg-[#7f95e0]"
          >
            Перезагрузить
          </button>
        </>
      )}
    </div>
  )
}
