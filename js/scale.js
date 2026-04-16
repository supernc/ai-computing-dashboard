/**
 * 16:9 等比缩放器
 */
function initScale() {
  const container = document.getElementById('dashboard');
  if (!container) return;

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scaleX = w / CONFIG.baseWidth;
    const scaleY = h / CONFIG.baseHeight;
    const scale = Math.min(scaleX, scaleY);

    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'left top';
    container.style.width = CONFIG.baseWidth + 'px';
    container.style.height = CONFIG.baseHeight + 'px';

    // 居中
    const offsetX = (w - CONFIG.baseWidth * scale) / 2;
    const offsetY = (h - CONFIG.baseHeight * scale) / 2;
    container.style.marginLeft = offsetX + 'px';
    container.style.marginTop = offsetY + 'px';
  }

  resize();
  window.addEventListener('resize', resize);
}
