/* Homepage controls. Case-study state and history belong to the shared viewer. */
(() => {
  const root = document.documentElement;
  const progress = document.querySelector('.progress span');
  let frame = 0;
  const updateProgress = () => {
    frame = 0;
    const max = root.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.max(0, Math.min(100, scrollY / max * 100)) : 0}%`;
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(updateProgress); };
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  new ResizeObserver(schedule).observe(document.body);
  updateProgress();

  const themeToggle = document.querySelector('.theme-toggle');
  try { document.body.classList.toggle('night', localStorage.getItem('swarom-theme') === 'night'); } catch { /* Storage can be unavailable; the control still works. */ }
  const syncTheme = () => {
    const night = document.body.classList.contains('night');
    themeToggle.textContent = night ? '☼' : '◐';
    themeToggle.setAttribute('aria-label', `Switch to ${night ? 'day' : 'night'} mode`);
    themeToggle.setAttribute('aria-pressed', String(night));
  };
  syncTheme();
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('night');
    try { localStorage.setItem('swarom-theme', document.body.classList.contains('night') ? 'night' : 'day'); } catch { /* Keep the in-memory choice. */ }
    syncTheme();
  });

  // Native links retain new-tab and no-JS behavior. Only case-study links are intercepted.
  document.querySelectorAll('a[href*="?project="]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !window.portfolioCaseStudy) return;
      const url = new URL(link.href);
      event.preventDefault();
      window.portfolioCaseStudy.open(url.searchParams.get('project'), link, Number(url.searchParams.get('slide')));
    });
  });

  // A small pointer accent follows actual input, with no perpetual animation loop.
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  const dot = document.querySelector('.cursor-dot');
  const clearCursor = () => document.body.classList.remove('has-cursor');
  addEventListener('pointermove', event => {
    if (motion.matches || !fine.matches || document.body.classList.contains('fc-viewing')) { clearCursor(); return; }
    dot.style.transform = `translate3d(${event.clientX + 12}px,${event.clientY + 12}px,0)`;
    document.body.classList.add('has-cursor');
  }, {passive:true});
  document.documentElement.addEventListener('pointerleave', clearCursor);
  motion.addEventListener('change', clearCursor);
  fine.addEventListener('change', clearCursor);
})();
