export function showAddonsNotice() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '10000';

  const modal = document.createElement('div');
  modal.style.background = '#121212';
  modal.style.padding = '20px 30px';
  modal.style.borderRadius = '8px';
  modal.style.maxWidth = '400px';
  modal.style.textAlign = 'center';
  modal.style.boxShadow = '0 0 10px #000';
  modal.style.color = 'white';
  modal.style.fontFamily = 'sans-serif';

  const h2 = document.createElement('h2');
  h2.innerText = 'Внимание';
  modal.appendChild(h2);

  const p = document.createElement('p');
  p.innerText = 'Функция «Аддоны» скоро будет добавлена следите за новостями!.';
  modal.appendChild(p);

  const btn = document.createElement('button');
  btn.innerText = 'Понятно';
  btn.style.marginTop = '20px';
  btn.style.padding = '8px 16px';
  btn.style.border = 'none';
  btn.style.background = '#00aa00';
  btn.style.color = 'white';
  btn.style.fontSize = '16px';
  btn.style.borderRadius = '5px';
  btn.style.cursor = 'pointer';
  btn.style.userSelect = 'none';

  btn.onmouseover = () => btn.style.background = '#009900';
  btn.onmouseout = () => btn.style.background = '#00aa00';

  btn.onclick = () => {
    document.body.removeChild(overlay);
  };

  modal.appendChild(btn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
