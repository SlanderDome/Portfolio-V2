/* Adapted from the scroll-driven scenes introduced in bb737f5 and removed in
 * 61cc1bd. Keep the original batched-read / scheduled-paint approach, but bound
 * the decoration inside the posters rather than outside the project rows. */
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const art = {
    foliage: '<path pathLength="1" d="M42 570C70 510 30 455 57 390S32 290 56 240M57 390Q95 360 92 330M48 470Q19 444 23 417"/><g class="scene-mark"><path d="M92 330Q55 326 57 390Q93 375 92 330Z"/><circle cx="56" cy="240" r="5"/></g>',
    judgement: '<path pathLength="1" d="M60 120V55h95M565 545h95v-65"/><g class="scene-mark"><path d="M96 490l15-24 15 24-15 24Z"/><circle cx="610" cy="105" r="11"/></g>',
    reconcile: '<path pathLength="1" d="M80 55h230m100 0h230M80 565h230m100 0h230"/><g class="scene-mark"><path d="M337 55l13 13 28-28M337 565l13 13 28-28"/></g>'
  };
  const scenes = [...document.querySelectorAll('.project')].map(project => {
    const key = project.dataset.project;
    const frame = project.querySelector('.poster-art');
    const layer = document.createElement('div');
    layer.className = 'poster-atmosphere';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = `<svg viewBox="${key === 'foliage' ? '0 0 640 720' : '0 0 720 600'}" focusable="false">${art[key]}</svg>`;
    frame.append(layer);
    return {frame, layer};
  });
  const nearby = new Set();
  let frame = 0;
  const paint = (scene, progress) => {
    scene.layer.style.setProperty('--scene-offset', String(1 - progress));
    scene.layer.style.setProperty('--scene-progress', String(progress));
  };
  function update() {
    frame = 0;
    if (motion.matches) { scenes.forEach(scene => paint(scene, 1)); return; }
    if (document.hidden || document.body.classList.contains('fc-viewing')) return;
    const positions = scenes.filter(scene => nearby.has(scene.frame)).map(scene => ({scene, top:scene.frame.getBoundingClientRect().top}));
    positions.forEach(({scene, top}) => {
      const p = Math.max(0, Math.min(1, (innerHeight * .95 - top) / (innerHeight * .65)));
      paint(scene, p * p * (3 - 2 * p));
    });
  }
  function schedule() {
    if (!frame && !document.hidden && (nearby.size || motion.matches)) frame = requestAnimationFrame(update);
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? nearby.add(entry.target) : nearby.delete(entry.target));
    schedule();
  });
  scenes.forEach(scene => observer.observe(scene.frame));
  addEventListener('scroll', () => { if (!motion.matches) schedule(); }, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', schedule);
  new MutationObserver(schedule).observe(document.body, {attributes:true, attributeFilter:['class']});
  schedule();
})();
