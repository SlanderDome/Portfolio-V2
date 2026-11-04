/* Scroll is the timeline: no animation loop, input interception, or audio. */
(() => {
  const section = document.querySelector('#work');
  if (!section || !('IntersectionObserver' in window)) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.min(1, Math.max(0, value));
  const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const svg = content => `<svg viewBox="0 0 80 600" preserveAspectRatio="none" focusable="false">${content}</svg>`;
  const draw = (d, extra = '') => `<path class="scene-line scene-draw ${extra}" pathLength="1" d="${d}"/>`;
  const leaf = (x, y, angle, delay) => `<g transform="translate(${x} ${y}) rotate(${angle})"><g class="scene-leaf-reveal" data-at="${delay}"><path class="scene-leaf" d="M0 0 C-32-12-29-44-5-57 C16-36 19-14 0 0Z"/><path class="scene-leaf-vein" d="M0 0 Q-11-29-5-50 M-6-20 L-19-29 M-8-32 L4-39"/></g></g>`;
  const vines = side => svg(side === 'left'
    ? `${draw('M-8 590 C65 522 10 469 35 395 S73 288 33 226 S7 111 55 12')}${draw('M35 395 Q12 368 5 329 M33 226 Q63 204 72 165', 'scene-fine')}${leaf(34,466,-34,.18)}${leaf(38,365,38,.35)}${leaf(43,272,-35,.52)}${leaf(25,170,28,.7)}<circle class="scene-line scene-fine" cx="50" cy="71" r="23"/><text class="scene-detail" x="8" y="570">01 / FLORA</text>`
    : `${draw('M87 570 C4 505 66 448 43 364 S4 274 44 189 S73 77 24 7')}${leaf(49,463,27,.2)}${leaf(36,338,-30,.4)}${leaf(39,215,38,.64)}${leaf(54,102,-27,.82)}<path class="scene-line scene-fine" d="M8 535H40 M24 519V551"/>`);
  const cards = side => svg(`<path class="scene-line scene-fine" d="M40 55V170 M40 425V545 M31 65H49 M31 535H49"/>${[-1,0,1].map((n,i) => `<g transform="translate(16 ${side === 'left' ? 230 : 280})"><g class="scene-card ${i === 0 ? 'scene-extra' : ''}" data-fan="${n}" data-at="${i*.13}"><rect class="scene-card-body" width="48" height="78" rx="4"/><rect class="scene-card-border" x="4" y="4" width="40" height="70" rx="2"/><path class="scene-card-border" d="M24 17L40 39 24 61 8 39Z"/><text class="scene-suit" x="24" y="46">${i === 1 ? '♠' : '♦'}</text></g></g>`).join('')}<text class="scene-detail" x="7" y="575">02 / DEAL</text>`);
  const ledger = side => svg(`${[110,180,250,320,390,460].map((y,i) => `${draw(`M${side === 'left' ? 0 : 80} ${y}H${side === 'left' ? 74 : 6}`)}<g class="scene-entry ${i%2 ? 'scene-extra' : ''}" data-offset="${(i%2 ? -1 : 1)*(26+i*5)}" data-at="${i*.075}" transform="translate(0 0)"><circle class="scene-transaction ${i%2 ? '' : 'scene-transaction-fill'}" cx="${side === 'left' ? 51 : 29}" cy="${y}" r="3"/><path class="scene-line scene-fine" d="M${side === 'left' ? 12 : 43} ${y-7}h20"/></g>`).join('')}${draw('M40 80V490','scene-fine')}<g class="scene-confirm"><circle class="scene-line" cx="40" cy="530" r="13"/><path class="scene-match" d="M34 530l4 4 8-9"/></g><text class="scene-detail" x="5" y="575">03 / ALIGN</text>`);
  const renderers = { foliage: vines, judgement: cards, reconcile: ledger };
  const scenes = [...section.querySelectorAll('.project[data-project]')].flatMap(project => {
    const key = project.dataset.project;
    if (!renderers[key]) return [];
    const layer = document.createElement('div');
    layer.className = `project-scene scene-${key}`;
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = ['left','right'].map(side => `<div class="scene-edge scene-edge-${side}">${renderers[key](side)}</div>`).join('');
    project.append(layer);
    return [{ project, layer, paths: [...layer.querySelectorAll('.scene-draw')], leaves: [...layer.querySelectorAll('.scene-leaf-reveal')], cards: [...layer.querySelectorAll('.scene-card')], entries: [...layer.querySelectorAll('.scene-entry')], confirms: [...layer.querySelectorAll('.scene-confirm')] }];
  });
  let frame = 0, sectionVisible = false;
  const nearby = new Set();
  function paint(scene, progress, opacity) {
    scene.layer.style.opacity = opacity.toFixed(3);
    scene.paths.forEach(path => path.style.strokeDashoffset = (1-progress).toFixed(3));
    scene.leaves.forEach(leaf => {
      const p = ease((progress - Number(leaf.dataset.at)) / .17);
      leaf.style.opacity = p.toFixed(3);
      leaf.style.transform = `scale(${.35+.65*p}) rotate(${(1-p)*-25}deg)`;
      leaf.style.transformOrigin = '0px 0px';
    });
    scene.cards.forEach(card => {
      const p = ease((progress - Number(card.dataset.at)) / .7);
      const fan = Number(card.dataset.fan);
      card.style.opacity = p.toFixed(3);
      card.style.transform = `translate(${fan*7*p}px,${(1-p)*65+Math.abs(fan)*6*p}px) rotate(${fan*17*p}deg)`;
    });
    scene.entries.forEach(entry => {
      const p = ease((progress-Number(entry.dataset.at))/.6);
      entry.style.transform = `translateY(${Number(entry.dataset.offset)*(1-p)}px)`;
      entry.style.opacity = p.toFixed(3);
    });
    scene.confirms.forEach(mark => mark.style.opacity = ease((progress-.8)/.2).toFixed(3));
  }
  function update() {
    frame = 0;
    if (document.hidden || document.body.classList.contains('fc-viewing')) return;
    if (motion.matches) { scenes.forEach(scene => paint(scene, 1, .65)); return; }
    if (!sectionVisible) return;
    // Batch all geometry reads before writing SVG styles; at most three rows.
    const measurements = scenes.filter(scene => nearby.has(scene.project)).map(scene => ({scene, rect:scene.project.getBoundingClientRect()}));
    measurements.forEach(({scene,rect}) => {
      const progress = ease((innerHeight * .94 - rect.top) / (innerHeight * .66));
      const distance = Math.abs(rect.top + rect.height/2 - innerHeight*.5);
      const focus = ease(1-distance/(rect.height*.5+innerHeight*.4));
      paint(scene, progress, focus * focus);
    });
  }
  function schedule() {
    if (!frame && !document.hidden && (sectionVisible || motion.matches)) frame = requestAnimationFrame(update);
  }
  const projectObserver = new IntersectionObserver(entries => {
    entries.forEach(({target,isIntersecting}) => {
      if (isIntersecting) nearby.add(target);
      else { nearby.delete(target); if (!motion.matches) scenes.find(scene=>scene.project===target).layer.style.opacity='0'; }
    });
    schedule();
  }, {rootMargin:'80px 0px'});
  scenes.forEach(scene=>projectObserver.observe(scene.project));
  new IntersectionObserver(([entry]) => {
    sectionVisible = entry.isIntersecting;
    if (!sectionVisible && frame) { cancelAnimationFrame(frame); frame=0; }
    schedule();
  }).observe(section);
  addEventListener('scroll', () => { if (!motion.matches) schedule(); }, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => {
    if (!motion.matches) scenes.forEach(scene=>paint(scene,0,0));
    schedule();
  });
  new MutationObserver(schedule).observe(document.body, {attributes:true,attributeFilter:['class']});
  schedule();
})();
