const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const year = document.querySelector('#year');
const glow = document.querySelector('.cursor-glow');
const heroVisual = document.querySelector('.hero-visual');
const contactForm = document.querySelector('#contact-form');

if (year) year.textContent = new Date().getFullYear();

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
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
}, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.querySelectorAll('.method-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.method-item').forEach(x => x.classList.remove('active'));
    item.classList.add('active');
  });
});

if (window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', event => {
    if (glow) {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }

    if (heroVisual && window.scrollY < window.innerHeight) {
      const x = (event.clientX / window.innerWidth - 0.5) * 7;
      const y = (event.clientY / window.innerHeight - 0.5) * 7;
      heroVisual.style.transform = `perspective(1100px) rotateY(${x * 0.35}deg) rotateX(${-y * 0.28}deg)`;
    }
  }, { passive: true });

  document.querySelector('.hero')?.addEventListener('mouseleave', () => {
    if (heroVisual) heroVisual.style.transform = '';
  });
}

contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get('name') || '';
  const age = data.get('age') || '–';
  const position = data.get('position') || '–';
  const goal = data.get('goal') || '';

  // Bei Bedarf hier die finale Kontaktadresse austauschen.
  const email = 'kontakt@musajamali-fussball.de';
  const subject = encodeURIComponent(`Trainingsanfrage von ${name}`);
  const body = encodeURIComponent(
`Hallo Musa,\n\nich interessiere mich für ein Training.\n\nName: ${name}\nAlter: ${age}\nPosition: ${position}\n\nMein Ziel:\n${goal}\n\nViele Grüße\n${name}`
  );

  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
});
