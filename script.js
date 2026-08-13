const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const year = document.querySelector('#year');
const cursor = document.querySelector('.cursor');
const contactForm = document.querySelector('#contact-form');
const selectedPlan = document.querySelector('#selected-plan');

if (year) year.textContent = new Date().getFullYear();

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

function setMenu(open) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
}

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenu(false);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = entry.target.dataset.delay || 0;
    entry.target.style.setProperty('--delay', `${delay}ms`);
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

if (window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', event => {
    if (!cursor) return;
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }, { passive: true });
}

document.querySelectorAll('.choose-plan').forEach(button => {
  button.addEventListener('click', event => {
    const plan = button.dataset.plan;
    if (!plan) return;
    if (selectedPlan) selectedPlan.value = plan;
    document.querySelector('#kontakt')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => selectedPlan?.focus({ preventScroll: true }), 550);
    event.preventDefault();
  });
});

contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get('name') || '';
  const age = data.get('age') || '–';
  const position = data.get('position') || '–';
  const plan = data.get('plan') || 'Noch offen';
  const goal = data.get('goal') || '';

  const email = 'kontakt@musajamali-fussball.de';
  const subject = encodeURIComponent(`Trainingsanfrage von ${name}`);
  const body = encodeURIComponent(
`Hallo Musa,\n\nich interessiere mich für dein Angebot.\n\nName: ${name}\nAlter: ${age}\nPosition: ${position}\nInteresse / Paket: ${plan}\n\nMein Ziel:\n${goal}\n\nViele Grüße\n${name}`
  );

  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
});
