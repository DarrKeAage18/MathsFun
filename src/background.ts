const SYMBOLS = ['+', '-', '=', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '×'];
const COLOURS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#C77DFF', '#ff9ff3', '#54a0ff'];

export function buildBackground(layerId: string): void {
  const layer = document.getElementById(layerId);
  if (!layer) return;

  for (let i = 0; i < 18; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = 30 + Math.random() * 120;
    b.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      bottom:-${size}px;
      background:${COLOURS[i % COLOURS.length]};
      animation-duration:${8 + Math.random() * 14}s;
      animation-delay:-${Math.random() * 16}s;
    `;
    layer.appendChild(b);
  }

  for (let i = 0; i < 20; i++) {
    const s = document.createElement('div');
    s.className = 'math-symbol';
    s.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    s.style.cssText = `
      left:${Math.random() * 100}%;
      bottom:-60px;
      animation-duration:${10 + Math.random() * 12}s;
      animation-delay:-${Math.random() * 20}s;
      color:rgba(255,255,255,0.07);
    `;
    layer.appendChild(s);
  }
}
