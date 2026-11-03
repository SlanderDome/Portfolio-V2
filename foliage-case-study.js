(() => {
  'use strict';
  const landing = 'Images/foliage_care/WhatsApp%20Image%202026-11-03%20at%2011.38.16%20PM.jpeg';
  const diagnose = 'Images/foliage_care/diagnose-page.png';
  const github = 'https://github.com/SlanderDome/Foliage_Care';
  const live = 'https://foliagecare.netlify.app/start';
  const leaf = `<svg class="fc-leaf" viewBox="0 0 400 440" role="img" aria-label="Botanical leaf schematic with branching veins"><path class="fc-leaf-outline" d="M200 390C40 340 47 154 200 35C353 154 360 340 200 390Z"/><path d="M200 420V50M200 140L161 111M200 180L132 131M200 220L113 164M200 260L105 207M200 300L116 254M200 340L141 310M200 140L239 111M200 180L268 131M200 220L287 164M200 260L295 207M200 300L284 254M200 340L259 310"/><circle cx="200" cy="220" r="130" stroke-dasharray="3 8"/><path class="fc-region" d="M242 164h56v74h-56zM122 267h48v45h-48z"/></svg>`;
  const photo = (src, alt, caption) => `<figure class="fc-photo"><img src="${src}" alt="${alt}" width="${src === diagnose ? 645 : 1600}" height="${src === diagnose ? 723 : 1000}"><figcaption>${caption}</figcaption></figure>`;
  const head = (n, label, title, text = '') => `<header class="fc-heading"><p class="fc-eyebrow">Field notes / ${n} — ${label}</p><h2 tabindex="-1">${title}</h2>${text ? `<p class="fc-intro">${text}</p>` : ''}</header>`;
  const slides = [
    { name: 'Opening poster', dark: true, className: 'fc-poster', html: `${head('01', 'Plant intelligence', 'Foliage<br><em>Care.</em>')}<div class="fc-poster-side"><p>From a photograph<br>to a better next step.</p><span>COMPUTER VISION / WEB PRODUCT<br>DESIGNED & BUILT BY SWAROM</span></div>${photo(landing, 'Foliage Care landing interface with consultation and care-plan introduction', '01.1 / The live plant wellness companion · authentic product screen')}<p class="fc-margin-note">A study in making plant-health guidance more visible, local, and conversational.</p>` },
    { name: 'The problem', dark: false, className: 'fc-problem', html: `${head('02', 'The question', 'A symptom is<br>only the <em>start.</em>', 'Recognizing a problem is one step. Knowing what to do next is another.')}<figure class="fc-specimen">${leaf}<figcaption>Fig. A / Specimen study · illustrative botanical diagram</figcaption></figure><ol class="fc-observations"><li><span>01 / SEE</span><p>Symptoms need explanation, not just a disease label.</p></li><li><span>02 / ACT</span><p>Advice needs to reflect the grower’s role and context.</p></li><li><span>03 / RETURN</span><p>A consultation should continue beyond the first answer.</p></li></ol>` },
    { name: 'Consultation flow', dark: false, className: 'fc-flow-slide', html: `${head('03', 'The experience', 'One consultation.<br>Four <em>movements.</em>')}<ol class="fc-flow"><li><span>01</span><i aria-hidden="true">⌕</i><h3>Diagnose</h3><p>Upload a photograph. Receive a structured symptom report and affected-region coordinates.</p></li><li><span>02 / OPTIONAL</span><i aria-hidden="true">◷</i><h3>Simulate</h3><p>Explore an illustrative seven-day untreated progression. A visualization, not a forecast.</p></li><li><span>03</span><i aria-hidden="true">↗</i><h3>Prescribe</h3><p>Start with household and organic options; reserve chemical interventions for last consideration.</p></li><li><span>04</span><i aria-hidden="true">↔</i><h3>Consult</h3><p>Ask follow-up questions grounded in the diagnosis, with multilingual responses.</p></li></ol><p class="fc-footnote">The journey is sequential. The progression image is optional. The conversation remains open.</p>` },
    { name: 'Visual evidence', dark: true, className: 'fc-evidence', html: `${head('04', 'Visible reasoning', 'Make the evidence<br><em>inspectable.</em>', 'A source-derived schematic of the response structure. This is an illustration, not a captured diagnosis.')}<div class="fc-evidence-layout"><figure class="fc-specimen fc-scan-specimen">${leaf}<span class="fc-scan-beam" aria-hidden="true"></span><figcaption>Fig. B / Illustrative regions · no real diagnosis shown</figcaption></figure><div class="fc-response"><span class="fc-eyebrow">IMAGE → STRUCTURED REPORT</span><dl><div><dt>Identification</dt><dd>Plant & disease labels</dd></div><div><dt>Evidence</dt><dd>Visual symptoms & severity</dd></div><div class="fc-coordinate"><dt>Affected regions</dt><dd>Coordinate-based overlays</dd></div><div><dt>Next steps</dt><dd>Actionable care guidance</dd></div></dl><button class="fc-scan-toggle" type="button" aria-pressed="false">Inspect affected regions <span aria-hidden="true">+</span></button><p class="fc-footnote">Optional interaction / reveal the schematic annotation layer.</p></div></div>` },
    { name: 'System architecture', dark: false, className: 'fc-architecture', html: `${head('05', 'Under the canopy', 'A connected<br><em>care system.</em>')}<div class="fc-network" role="img" aria-label="Architecture: Open-Meteo sends weather to the browser. Browser calls FastAPI, which routes to AI providers and Hugging Face. Browser uses Firebase for authentication and history."><svg class="fc-connectors" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true"><path d="M100 60V180H360M100 180V305H360M360 180H640M640 180V60H900M640 180H900M640 180V305H900"/></svg><div class="fc-node fc-weather"><span>01 / CONTEXT</span><h3>Open-Meteo</h3><p>Location & weather retrieval</p></div><div class="fc-node fc-browser"><span>02 / CLIENT</span><h3>Browser</h3><p>Vanilla JavaScript · Leaflet</p></div><div class="fc-node fc-firebase"><span>03 / PERSISTENCE</span><h3>Firebase</h3><p>Authentication · Firestore history</p></div><div class="fc-node fc-api"><span>04 / REST</span><h3>FastAPI</h3><p>Diagnosis · plans · follow-up</p></div><div class="fc-node fc-models"><span>05 / CONSULTATION</span><h3>AI providers</h3><p>Gemini → Groq → OpenAI</p></div><div class="fc-node fc-prompt"><span>06 / SIMULATION PROMPT</span><h3>Gemini</h3><p>Context-to-image prompt</p></div><div class="fc-node fc-hf"><span>07 / IMAGE GENERATION</span><h3>Hugging Face</h3><p>SD 1.5 → FLUX.1 → SD 1.5</p></div></div><p class="fc-footnote">Source note / weather retrieval exists; the diagnosis request’s weather field is not yet consistently wired end to end.</p>` },
    { name: 'Engineering depth', dark: true, className: 'fc-engineering', html: `${head('06', 'Engineering notes', 'Careful choices.<br>Honest <em>boundaries.</em>')}<div class="fc-engineering-layout"><div class="fc-lanes"><section><span>01 / RESILIENCE</span><h3>More than one route.</h3><p>Consultation can fall back across configured Gemini, Groq, and OpenAI engines.</p></section><section><span>02 / CONTEXT</span><h3>Advice has an audience.</h3><p>Distinct prompts for farmers, nursery operators, home gardeners, and students or researchers.</p></section><section><span>03 / CONTINUITY</span><h3>A scan becomes a record.</h3><p>Firebase Authentication and Firestore support plant records, scan history, and My Garden.</p></section><section><span>04 / OPTIONAL GENERATION</span><h3>Visualize a possibility.</h3><p>Stable Diffusion image-to-image → FLUX.1-schnell → Stable Diffusion text-to-image.</p></section></div><aside class="fc-source-rail"><span class="fc-eyebrow">SOURCE NOTES</span><p>Provider fallback requires configured credentials and service availability.</p><p>Progression images are illustrations, not validated scientific forecasts.</p><p>Diagnosis sends <code>weather_trend</code>; the API expects <code>weather</code>. Weather-aware diagnosis remains an integration limitation.</p><p>AI advice supports decisions. It does not replace a qualified plant-health assessment.</p></aside></div>` },
    { name: 'Closing statement', dark: false, className: 'fc-closing', html: `${head('07', 'Keep growing', 'Better questions.<br>More thoughtful<br><em>plant care.</em>')}<div class="fc-closing-image">${photo(diagnose, 'Authentic Foliage Care consultation entry screen', '07.1 / Consultation entry · authentic product screen')}</div><div class="fc-closing-copy"><p>Built to connect observation, explanation, and the next useful action.</p><p class="fc-tech">PYTHON · FASTAPI · JAVASCRIPT<br>GEMINI · FIREBASE · LEAFLET · HUGGING FACE</p><div class="fc-closing-links"><a href="${live}" target="_blank" rel="noreferrer">Explore the product ↗</a><a href="${github}" target="_blank" rel="noreferrer">Read the source ↗</a></div></div>` }
  ];
  const dialog = document.createElement('dialog');
  dialog.className = 'fc-viewer';
  dialog.setAttribute('aria-label', 'Foliage Care case study');
  dialog.innerHTML = `<div class="fc-shell"><header class="fc-chrome"><div class="fc-brand"><span class="fc-brand-mark" aria-hidden="true">✳</span><span>Foliage Care<small>FIELD JOURNAL / CASE STUDY 01</small></span></div><nav aria-label="Project resources"><a href="${github}" target="_blank" rel="noreferrer">GitHub ↗</a><a href="${live}" target="_blank" rel="noreferrer">Live ↗</a></nav><button class="fc-close" type="button" aria-label="Close Foliage Care case study">×</button></header><div class="fc-stage"></div><footer class="fc-navigation"><button class="fc-prev" type="button" aria-label="Previous slide">← <span>Previous</span></button><div class="fc-position"><span class="fc-count"></span><span class="fc-slide-name"></span></div><button class="fc-next" type="button" aria-label="Next slide"><span>Next</span> →</button><div class="fc-progress" role="progressbar" aria-label="Case study progress" aria-valuemin="1" aria-valuemax="7"><span></span></div></footer><p class="fc-live-region" aria-live="polite" aria-atomic="true"></p></div>`;
  document.body.append(dialog);
  const stage = dialog.querySelector('.fc-stage');
  const shell = dialog.querySelector('.fc-shell');
  const prev = dialog.querySelector('.fc-prev');
  const next = dialog.querySelector('.fc-next');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let index = -1, trigger = null, savedScroll = 0, active = [], closeAnimation = null;
  let session = null, depth = 0, closingRoute = false, hasPortfolioOrigin = false;
  const duration = normal => reduced.matches ? Math.min(normal, 100) : normal;
  const animate = (el, frames, ms, delay = 0) => {
    const animation = el.animate(frames, { duration: duration(ms), delay: reduced.matches ? 0 : delay, easing: 'cubic-bezier(.22,1,.36,1)' });
    active.push(animation); return animation;
  };
  function renderSlide(to) {
    const forward = to >= index;
    active.forEach(a => a.cancel()); active = [];
    stage.querySelectorAll('.fc-outgoing').forEach(el => el.remove());
    const old = stage.querySelector('.fc-slide');
    if (old) {
      old.classList.add('fc-outgoing'); old.inert = true; old.setAttribute('aria-hidden', 'true');
      animate(old, reduced.matches ? [{opacity:1},{opacity:0}] : [{opacity:1,transform:'translateX(0)'},{opacity:0,transform:`translateX(${forward ? '-6vw' : '6vw'})`}], 420).finished.then(() => old.remove()).catch(() => old.remove());
    }
    index = to;
    const data = slides[index];
    const slide = document.createElement('section');
    slide.className = `fc-slide ${data.className} ${data.dark ? 'fc-dark' : 'fc-light'}`;
    slide.setAttribute('aria-label', `${index + 1} of 7: ${data.name}`);
    slide.innerHTML = data.html; stage.append(slide);
    animate(slide, reduced.matches ? [{opacity:0},{opacity:1}] : [{opacity:0,transform:`translateX(${forward ? '6vw' : '-6vw'})`},{opacity:1,transform:'translateX(0)'}], 420);
    slide.querySelectorAll('.fc-heading,.fc-intro,.fc-photo,.fc-specimen,.fc-flow,.fc-network,.fc-engineering-layout,.fc-closing-copy').forEach((el, i) => animate(el, reduced.matches ? [{opacity:0},{opacity:1}] : [{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}], 460, [0,70,110,170,220][Math.min(i,4)]));
    slide.querySelectorAll('.fc-node').forEach((node, i) => animate(node, [{opacity:0},{opacity:1}],420,i * 80));
    const scan = slide.querySelector('.fc-scan-toggle');
    if (scan) scan.addEventListener('click', () => {
      const on = scan.getAttribute('aria-pressed') !== 'true';
      scan.setAttribute('aria-pressed', String(on)); slide.classList.toggle('fc-inspecting', on);
      scan.innerHTML = `${on ? 'Hide' : 'Inspect'} affected regions <span aria-hidden="true">${on ? '−' : '+'}</span>`;
    });
    dialog.querySelector('.fc-count').textContent = `${String(index + 1).padStart(2,'0')} / 07`;
    dialog.querySelector('.fc-slide-name').textContent = data.name;
    dialog.querySelector('.fc-progress span').style.transform = `scaleX(${(index + 1) / 7})`;
    dialog.querySelector('.fc-progress').setAttribute('aria-valuenow', String(index + 1));
    prev.disabled = index === 0; next.disabled = index === 6;
    dialog.querySelector('.fc-live-region').textContent = `Slide ${index + 1} of 7. ${data.name}`;
    slide.querySelector('h2').focus({preventScroll:true});
  }
  function show(to) {
    dialog.classList.remove('fc-exiting');
    if (closeAnimation) { closeAnimation.cancel(); closeAnimation = null; }
    if (!dialog.open) {
      savedScroll = scrollY;
      document.body.classList.add('fc-viewing');
      dialog.showModal();
      animate(dialog.querySelector('.fc-chrome'),[{opacity:0},{opacity:1}],420,100);
      shell.animate(reduced.matches ? [{opacity:0},{opacity:1}] : [{opacity:0,transform:'translateY(24px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}], {duration:duration(460),easing:'cubic-bezier(.22,1,.36,1)'});
    }
    if (to !== index || !stage.children.length) renderSlide(to);
  }
  async function hide() {
    if (!dialog.open || closeAnimation) return;
    active.forEach(a => a.cancel()); active = [];
    dialog.classList.add('fc-exiting');
    stage.animate([{opacity:1},{opacity:0}],{duration:duration(120)});
    closeAnimation = shell.animate(reduced.matches ? [{opacity:1},{opacity:0}] : [{opacity:1,transform:'scale(1)'},{opacity:0,transform:'translateY(12px) scale(.985)'}], {duration:duration(260),easing:'cubic-bezier(.22,1,.36,1)'});
    try { await closeAnimation.finished; } catch { return; }
    closeAnimation = null; dialog.close(); stage.replaceChildren(); index = -1;
    document.body.classList.remove('fc-viewing'); scrollTo(0,savedScroll);
    if (trigger?.isConnected) trigger.focus({preventScroll:true});
    closingRoute = false;
  }
  function readRoute() {
    const url = new URL(location.href), project = url.searchParams.get('project');
    if (project === 'foliage') {
      const raw = url.searchParams.get('slide');
      const value = Number(raw);
      const slide = Number.isFinite(value) ? Math.max(1,Math.min(7,Math.trunc(value))) : 1;
      if (raw !== String(slide)) { url.searchParams.set('slide',String(slide)); history.replaceState(history.state,'',url); }
      const state = history.state?.foliageDeck;
      depth = state?.session === session ? state.depth : 0;
      closingRoute = false; show(slide - 1);
    } else {
      if (project && !['judgement','reconcile'].includes(project)) { url.searchParams.delete('project'); url.searchParams.delete('slide'); history.replaceState(history.state,'',url); }
      depth = 0; hide();
    }
  }
  function navigate(to) {
    if (closingRoute || to < 0 || to > 6 || to === index) return;
    const url = new URL(location.href);
    url.searchParams.set('project','foliage'); url.searchParams.set('slide',String(to + 1));
    if (!session) session = `${Date.now()}-${Math.random()}`;
    history.pushState({...history.state,foliageDeck:{session,depth:++depth}},'',url);
    show(to);
  }
  function close() {
    if (closingRoute) return;
    closingRoute = true;
    if (hasPortfolioOrigin && depth > 0 && session) history.go(-depth);
    else {
      const url = new URL(location.href); url.searchParams.delete('project'); url.searchParams.delete('slide');
      const state = {...history.state}; delete state.foliageDeck;
      history.replaceState(state,'',url); hide();
    }
  }
  window.foliageCaseStudy = {open(control) {
    trigger = control?.closest?.('[data-project="foliage"]')?.querySelector('.project-open') || document.querySelector('[data-project="foliage"] .project-open');
    if (dialog.open) return;
    hasPortfolioOrigin = true;
    session = `${Date.now()}-${Math.random()}`; depth = 0;
    navigate(0);
  }};
  prev.addEventListener('click', () => navigate(index - 1));
  next.addEventListener('click', () => navigate(index + 1));
  dialog.querySelector('.fc-close').addEventListener('click', close);
  dialog.addEventListener('cancel', e => {e.preventDefault();close();});
  dialog.addEventListener('click', e => {if(e.target === dialog) close();});
  dialog.addEventListener('keydown', e => {
    if (e.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {e.preventDefault();navigate(index + (e.key === 'ArrowRight' ? 1 : -1));}
  });
  let touch = null;
  stage.addEventListener('touchstart', e => {
    if(e.touches.length !== 1 || e.target.closest('a,button,input,[data-no-swipe]')) {touch=null;return;}
    touch = {x:e.touches[0].clientX,y:e.touches[0].clientY};
  },{passive:true});
  stage.addEventListener('touchend', e => {
    if(!touch) return;
    const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y; touch=null;
    if(Math.abs(dx)>48 && Math.abs(dx)>Math.abs(dy)*1.25) navigate(index+(dx<0?1:-1));
  },{passive:true});
  stage.addEventListener('touchcancel',()=>touch=null,{passive:true});
  addEventListener('popstate', readRoute);
  readRoute();
})();
