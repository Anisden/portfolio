// CAD Blueprint Canvas & Coordinate Tracker HUD
export function initBlueprintCanvas() {
  const canvas = document.getElementById('blueprint-canvas');
  const hud = document.getElementById('coord-hud');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouse = { x: -1000, y: -1000, active: false };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    draw();
  }

  function getAccentWithAlpha(alpha) {
    const computedStyle = getComputedStyle(document.documentElement);
    let accent = computedStyle.getPropertyValue('--accent').trim() || '#d4af37';
    if (accent.startsWith('#')) {
      const r = parseInt(accent.slice(1, 3), 16);
      const g = parseInt(accent.slice(3, 5), 16);
      const b = parseInt(accent.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return accent;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Interactive CAD cursor reticle
    if (mouse.active) {
      // Light technical infinite crosshairs
      ctx.strokeStyle = getAccentWithAlpha(0.25); // Increased from 0.12 for crisp visibility
      ctx.lineWidth = 0.5;

      // Full screen crosshair
      ctx.beginPath();
      ctx.moveTo(mouse.x, 0);
      ctx.lineTo(mouse.x, height);
      ctx.moveTo(0, mouse.y);
      ctx.lineTo(width, mouse.y);
      ctx.stroke();

      // Precision center ring
      ctx.strokeStyle = getAccentWithAlpha(0.6); // Increased from 0.4 for sharp view
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
      ctx.stroke();
      
      // Infinite cursor micro-dots at crosshair intersections
      ctx.fillStyle = getAccentWithAlpha(0.85); // Increased from 0.6
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  window.addEventListener('resize', resize);
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    
    // Update CAD HUD with precise decimal coordinates
    if (hud) {
      hud.textContent = `X: ${mouse.x.toFixed(3)}, Y: ${mouse.y.toFixed(3)}`;
    }
    
    draw();
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    draw();
  });

  resize();
}
