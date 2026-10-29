const progress = document.querySelector('.progress span');
const updateProgress = () => { const max = document.documentElement.scrollHeight - innerHeight; progress.style.setProperty('--scroll', `${max ? (scrollY / max) * 100 : 0}%`); };
addEventListener('scroll', updateProgress, { passive: true }); updateProgress();

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

if (matchMedia('(pointer:fine)').matches) {
  const dot = document.querySelector('.cursor-dot'), ring = document.querySelector('.cursor-ring');
  addEventListener('pointermove', e => { dot.style.cssText += `;transform:translate(${e.clientX}px,${e.clientY}px);opacity:1`; ring.style.cssText += `;transform:translate(${e.clientX}px,${e.clientY}px);opacity:1`; });
  document.querySelectorAll('a,button,.project').forEach(el => { el.addEventListener('pointerenter', () => ring.classList.add('active')); el.addEventListener('pointerleave', () => ring.classList.remove('active')); });
  document.querySelectorAll('.magnetic').forEach(el => { el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left - r.width / 2) * .16, y = (e.clientY - r.top - r.height / 2) * .16; el.style.transform = `translate(${x}px,${y}px)`; }); el.addEventListener('pointerleave', () => el.style.transform = ''); });
}

const themeButton = Object.assign(document.createElement('button'), { className: 'theme-float magnetic', type: 'button', ariaLabel: 'Toggle colour theme', textContent: '◐' });
document.body.append(themeButton);
const toggleTheme = () => { const night = document.body.classList.toggle('night'); themeButton.textContent = night ? '☼' : '◐'; localStorage.setItem('swarom-theme', night ? 'night' : 'day'); };
if (localStorage.getItem('swarom-theme') === 'night') toggleTheme();
themeButton.addEventListener('click', toggleTheme);

const cases = {
  foliage: { type: 'AI / COMPUTER VISION', title: 'Foliage<br><em>Care</em>', text: 'A plant-health companion that combines visual diagnosis with local weather and GPS context, then makes the next step clear.', facts: ['89% diagnosis confidence', '7-day progression preview', 'Live community map'] },
  term: { type: 'EDUCATION / SYSTEMS', title: 'Term-<em>Track</em>', text: 'A course-management and academic-eligibility system that moves students from uncertainty to a clear next action.', facts: ['3 roles', 'Automated eligibility', 'MySQL-backed'] },
  reconcile: { type: 'FINTECH / UTILITY', title: 'Reconcile<em>.ly</em>', text: 'A focused reconciliation workspace for spotting short payments, surfacing recovery potential, and generating claims quickly.', facts: ['CSV / XLSX ingest', '2% tolerance logic', 'One-click claims'] }
};
const dialog = document.querySelector('#caseStudy'), content = dialog.querySelector('.case-content');
function openCase(project) { const item = cases[project]; content.innerHTML = `<p class="case-type">${item.type}</p><div><h2>${item.title}</h2><p>${item.text}</p></div><div class="case-facts">${item.facts.map(f => `<span>${f}</span>`).join('')}</div>`; dialog.showModal(); }
document.querySelectorAll('.project').forEach((card, index) => { const key = ['foliage','term','reconcile'][index]; card.addEventListener('click', () => openCase(key)); card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCase(key); }}); });
dialog.querySelector('.case-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

const rail = document.querySelector('.lab-rail'); let down = false, startX = 0, startScroll = 0;
rail.addEventListener('pointerdown', e => { down = true; startX = e.clientX; startScroll = rail.scrollLeft; rail.classList.add('dragging'); rail.setPointerCapture(e.pointerId); });
rail.addEventListener('pointermove', e => { if (down) rail.scrollLeft = startScroll - (e.clientX - startX); });
rail.addEventListener('pointerup', () => { down = false; rail.classList.remove('dragging'); });
