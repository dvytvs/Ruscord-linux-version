export function showAddonsNotice() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.75)';
  overlay.style.zIndex = '10000';

  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '20vh';
  modal.style.left = '20px';
  modal.style.width = '380px';
  modal.style.background = '#121212';
  modal.style.padding = '20px 30px 20px 70px';
  modal.style.borderRadius = '8px';
  modal.style.boxShadow = '0 0 15px #000';
  modal.style.color = 'white';
  modal.style.fontFamily = 'sans-serif';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.gap = '15px';

  const icon = document.createElement('img');
  icon.src = './assets/Images/addons.png';
  icon.style.width = '40px';
  icon.style.height = '40px';
  icon.style.position = 'absolute';
  icon.style.left = '15px';
  icon.style.top = '50%';
  icon.style.transform = 'translateY(-50%)';

  const content = document.createElement('div');
  content.style.flex = '1';

  const h2 = document.createElement('h2');
  h2.innerText = 'Внимание';
  h2.style.margin = '0 0 10px 0';

  const p = document.createElement('p');
  p.innerText = 'Расширения скоро будут следите за обновлениями.';
  p.style.margin = '0';

  content.appendChild(h2);
  content.appendChild(p);

  const closeBtn = document.createElement('button');
  closeBtn.innerText = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '8px';
  closeBtn.style.right = '8px';
  closeBtn.style.border = 'none';
  closeBtn.style.background = 'transparent';
  closeBtn.style.color = 'white';
  closeBtn.style.fontSize = '24px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.userSelect = 'none';
  closeBtn.style.lineHeight = '1';
  closeBtn.style.padding = '0';

  closeBtn.onmouseenter = () => closeBtn.style.color = '#00aa00';
  closeBtn.onmouseleave = () => closeBtn.style.color = 'white';

  closeBtn.onclick = () => {
    document.body.removeChild(overlay);
  };

  modal.appendChild(icon);
  modal.appendChild(content);
  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
