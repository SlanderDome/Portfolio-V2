/* Adapted from the scroll-driven scenes introduced in bb737f5 and removed in
 * 61cc1bd. Keep the original batched-read / scheduled-paint approach, but bound
 * the decoration inside the posters rather than outside the project rows. */
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const art = {
    foliage: '<path pathLength="1" d="M42 570C70 510 30 455 57 390S32 290 56 240M57 390Q95 360 92 330M48 470Q19 444 23 417"/><path class="scene-detail" pathLength="1" d="M320 590C324 465 335 340 383 180M325 510Q260 485 225 430M331 449Q393 424 435 380M342 381Q282 350 255 300M355 315Q398 292 416 254"/><g class="scene-mark scene-leaf"><path d="M92 330Q55 326 57 390Q93 375 92 330Z"/><circle cx="56" cy="240" r="5"/><circle cx="383" cy="180" r="5"/></g>',
    judgement: '<path pathLength="1" d="M60 120V55h95M565 545h95v-65"/><g class="scene-card scene-card-left"><rect x="72" y="168" width="68" height="100" rx="4" transform="rotate(-12 106 218)"/><path d="M96 216l10-17 10 17-10 17Z"/></g><g class="scene-card scene-card-right"><rect x="580" y="330" width="68" height="100" rx="4" transform="rotate(12 614 380)"/><path d="M604 378l10-17 10 17-10 17Z"/></g><g class="scene-mark"><path d="M96 490l15-24 15 24-15 24Z"/><circle cx="610" cy="105" r="11"/></g>',
    reconcile: '<path pathLength="1" d="M80 55h230m100 0h230M80 565h230m100 0h230"/><path class="scene-detail" pathLength="1" d="M105 160H205M105 225H180M515 160H615M540 225H615M105 440H190M530 440H615"/><g class="scene-mark scene-match"><circle cx="360" cy="310" r="28"/><path d="M346 310l10 10 20-22M337 55l13 13 28-28M337 565l13 13 28-28"/></g>'
  };
  const scenes = [...document.querySelectorAll('.project')].map(project => {
    const key = project.dataset.project;
    const frame = project.querySelector('.poster-art');
    const layer = document.createElement('div');
    layer.className = 'poster-atmosphere';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = `<svg viewBox="${key === 'foliage' ? '0 0 640 720' : '0 0 720 600'}" focusable="false">${art[key]}</svg>`;
    frame.append(layer);
    // Keep the original image as an accessible, no-JavaScript fallback. An
    // inline copy lets the scroll scene move the actual artwork's elements.
    const image = frame.querySelector('img');
    fetch(image.src).then(response => {
      if (!response.ok) throw new Error('Poster unavailable');
      return response.text();
    }).then(source => {
      const svg = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;
      if (svg.localName !== 'svg' || svg.querySelector('parsererror')) return;
      const artwork = document.createElement('div');
      artwork.className = 'poster-motion-art';
      artwork.setAttribute('aria-hidden', 'true');
      artwork.append(document.importNode(svg, true));
      frame.insertBefore(artwork, layer);
      frame.classList.add('poster-motion-ready');
    }).catch(() => {});
    return {frame, layer};
  });
  const nearby = new Set();
  let frame = 0;
  const paint = (scene, progress) => {
    scene.layer.style.setProperty('--scene-offset', String(1 - progress));
    scene.layer.style.setProperty('--scene-progress', String(progress));
    scene.frame.style.setProperty('--art-progress', String(progress));
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
