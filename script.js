const root = document.documentElement;
const progress = document.querySelector('.progress span');
const updateProgress = () => {
  const max = root.scrollHeight - innerHeight;
  progress.style.width = `${max ? (scrollY / max) * 100 : 0}%`;
};
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const darkMode = localStorage.getItem('swarom-theme') === 'night';
if (darkMode) document.body.classList.add('night');
const themeToggle = document.querySelector('.theme-toggle');
const setThemeIcon = () => { themeToggle.textContent = document.body.classList.contains('night') ? '☼' : '◐'; };
setThemeIcon();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('night');
  localStorage.setItem('swarom-theme', document.body.classList.contains('night') ? 'night' : 'day');
  setThemeIcon();
});

if (matchMedia('(pointer:fine)').matches) {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let x = -100, y = -100, rx = -100, ry = -100;
  addEventListener('pointermove', event => { x = event.clientX; y = event.clientY; });
  const renderCursor = () => {
    dot.style.transform = `translate3d(${x}px,${y}px,0)`;
    rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0) scale(${ring.dataset.active === 'true' ? 1.65 : 1})`;
    requestAnimationFrame(renderCursor);
  };
  renderCursor();
  document.body.classList.add('has-cursor');
  document.querySelectorAll('a, button, .project').forEach(el => {
    el.addEventListener('pointerenter', () => ring.dataset.active = 'true');
    el.addEventListener('pointerleave', () => ring.dataset.active = 'false');
  });
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('pointermove', event => {
      const box = el.getBoundingClientRect();
      el.style.transform = `translate(${(event.clientX - box.left - box.width / 2) * .13}px, ${(event.clientY - box.top - box.height / 2) * .13}px)`;
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const amount = Number(el.dataset.parallax);
    el.addEventListener('pointermove', event => {
      const box = el.getBoundingClientRect();
      const px = ((event.clientX - box.left) / box.width - .5) * amount;
      const py = ((event.clientY - box.top) / box.height - .5) * amount;
      el.style.setProperty('--px', `${px}px`);
      el.style.setProperty('--py', `${py}px`);
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--px', '0px'); el.style.setProperty('--py', '0px'); });
  });
}

const cases = {
  foliage: { label: 'AI / COMPUTER VISION', title: 'Foliage<br><em>Care</em>', copy: 'Foliage Care is a plant wellness companion that uses photo diagnosis to identify disease regions, then turns the result into specific, local care guidance.', facts: ['Region-overlay diagnosis', 'Multilingual consultation', 'Context-aware care plan'], image: 'Images/foliage_care/WhatsApp%20Image%202026-11-03%20at%2011.38.16%20PM.jpeg', alt: 'Foliage Care interface', href: 'https://foliagecare.netlify.app/start', action: 'Visit Foliage Care' },
  judgement: { label: 'MULTIPLAYER / REAL-TIME', title: 'Judgement<br><em>Online</em>', copy: 'A room-based multiplayer card game where a server-authoritative Node.js engine validates every bid, play, score, timer, and state transition in real time.', facts: ['React + Vite client', 'Socket.io state sync', 'Server-authoritative rules'], image: 'Images/judgement/Screenshot%202026-11-04%20015938.png', alt: 'Judgement Online card table', href: 'https://github.com/SlanderDome/Judgement', action: 'View on GitHub' },
  reconcile: { label: 'FINTECH / UTILITY', title: 'Reconcile<em>.ly</em>', copy: 'A browser-based payments reconciliation workspace built to expose timing gaps, duplicates, rounding differences, and unreconciled value with clarity.', facts: ['CSV / XLSX workflow', 'Live reconciliation dashboard', 'Claims-ready insight'], image: 'Images/reconcily/WhatsApp%20Image%202026-11-03%20at%2011.38.19%20PM.jpeg', alt: 'Reconcile.ly interface', href: 'https://reconcilely.netlify.app/', action: 'Visit Reconcile.ly' }
};
const dialog = document.querySelector('#caseStudy');
const caseContent = dialog.querySelector('.case-content');
const openCase = key => {
  if (key === 'foliage') { window.foliageCaseStudy.open(document.activeElement); return; }
  const item = cases[key];
  caseContent.innerHTML = `<p class="case-type">${item.label}</p><div><h2>${item.title}</h2><p>${item.copy}</p></div><img class="case-screenshot" src="${item.image}" alt="${item.alt}"><div class="case-facts">${item.facts.map(fact => `<span>${fact}</span>`).join('')}</div><a class="case-action magnetic" href="${item.href}" target="_blank" rel="noreferrer">${item.action} <b>↗</b></a>`;
  dialog.showModal();
};
document.querySelectorAll('.project[data-project]').forEach(card => {
  const open = () => openCase(card.dataset.project);
  card.addEventListener('click', open);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
  });
});
dialog.querySelector('.case-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

const rail = document.querySelector('.lab-rail');
let dragging = false, startX = 0, startScroll = 0;
rail.addEventListener('pointerdown', event => {
  dragging = true; startX = event.clientX; startScroll = rail.scrollLeft;
  rail.classList.add('dragging'); rail.setPointerCapture(event.pointerId);
});
rail.addEventListener('pointermove', event => { if (dragging) rail.scrollLeft = startScroll - (event.clientX - startX); });
['pointerup', 'pointercancel'].forEach(type => rail.addEventListener(type, () => { dragging = false; rail.classList.remove('dragging'); }));
