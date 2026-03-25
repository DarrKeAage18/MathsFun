const CONFETTI_COLOURS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#C77DFF', '#ff9ff3', '#ffffff'];
const SHAPES = ['50%', '0%'];

export function launchConfetti(layerId: string): void {
  const layer = document.getElementById(layerId);
  if (!layer) return;

  for (let i = 0; i < 140; i++) {
    const cf = document.createElement('div');
    cf.className = 'cf';
    cf.style.cssText = `
      left:${Math.random() * 100}%;
      top: 0;
      background:${CONFETTI_COLOURS[Math.floor(Math.random() * CONFETTI_COLOURS.length)]};
      border-radius:${SHAPES[Math.floor(Math.random() * SHAPES.length)]};
      width:${6 + Math.random() * 10}px;
      height:${6 + Math.random() * 10}px;
      animation-duration:${2.5 + Math.random() * 2.5}s;
      animation-delay:${Math.random() * 1.5}s;
    `;
    layer.appendChild(cf);
    cf.addEventListener('animationend', () => cf.remove());
  }
}
