const progress = document.querySelector('.progress span');
const updateProgress = () => { const max = document.documentElement.scrollHeight - innerHeight; progress.style.setProperty('--scroll', `${max ? (scrollY / max) * 100 : 0}%`); };
addEventListener('scroll', updateProgress, { passive: true }); updateProgress();
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
