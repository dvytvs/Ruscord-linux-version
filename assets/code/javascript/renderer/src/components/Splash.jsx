import React, { useEffect, useState } from 'react';

export default function Splash() {
  const [status, setStatus] = useState('Подготовка...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.electronAPI.onUpdateAvailable(version => {
      setStatus(`Доступно обновление: ${version}`);
    });

    window.electronAPI.onUpdateProgress(data => {
      setProgress(data.percent);
      setStatus(`Скачано ${formatBytes(data.transferred)} из ${formatBytes(data.total)}`);
    });

    window.electronAPI.onUpdateDownloaded(() => {
      setStatus('Обновление загружено. Ждём подтверждения...');
    });

    window.electronAPI.onUpdateError(msg => {
      setStatus(`Ошибка обновления: ${msg}`);
    });

    window.electronAPI.checkConnection().then(isOnline => {
      if (!isOnline) updateConnectionLoop();
      else setStatus('Подключаемся');
    });
  }, []);

  function updateConnectionLoop() {
    const interval = setInterval(async () => {
      const isOnline = await window.electronAPI.checkConnection();
      const time = new Date().toLocaleTimeString();
      if (isOnline) {
        clearInterval(interval);
        setStatus('Подключаемся');
      } else {
        setStatus(`Попытка подключения ${time}`);
      }
    }, 2000);
  }

  function formatBytes(bytes) {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' ГБ';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' МБ';
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' КБ';
    return bytes + ' Б';
  }

  return (
    <div style={{
      background: '#121212',
      color: '#fff',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <img src="../../Images/icon2.png" style={{ width: '100px', animation: 'pulse 2s infinite' }} alt="Ruscord" />
      <div style={{ marginTop: '20px' }}>{status}</div>
      <div style={{ marginTop: '10px', width: '80%', height: '4px', background: '#444', borderRadius: '2px' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#262626' }}></div>
      </div>
    </div>
  );
}
