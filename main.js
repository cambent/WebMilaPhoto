/* ================================
   FOTOGRAFÍA — style.css
   Dark minimal, image-first
   ================================ */

// ── CURSOR ───────────────────────
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

// smooth ring follow
(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// hover expand
document.querySelectorAll('a, button, .grid-item, .carousel-slide').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});


// ── SCROLL REVEAL ────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ── CAROUSEL ─────────────────────
const track    = document.querySelector('.carousel-track');
const slides   = [...document.querySelectorAll('.carousel-slide')];
const btnPrev  = document.getElementById('btn-prev');
const btnNext  = document.getElementById('btn-next');
const counter  = document.getElementById('carousel-counter');

let current = 0;
const total = slides.length;

function getSlideWidth() {
  if (!slides[0]) return 0;
  const style = getComputedStyle(slides[0]);
  return slides[0].offsetWidth + parseInt(style.marginRight || 0) + 2; // +gap (2px)
}

function goTo(index) {
  current = Math.max(0, Math.min(index, total - 1));
  track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
  counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  btnPrev.disabled = current === 0;
  btnNext.disabled = current === total - 1;
  btnPrev.style.opacity = current === 0 ? '0.3' : '1';
  btnNext.style.opacity = current === total - 1 ? '0.3' : '1';
}

btnPrev.addEventListener('click', () => goTo(current - 1));
btnNext.addEventListener('click', () => goTo(current + 1));

// touch / drag swipe
let startX = 0, isDragging = false;

track.addEventListener('pointerdown', e => {
  startX = e.clientX;
  isDragging = true;
  track.style.transition = 'none';
  track.setPointerCapture(e.pointerId);
});
track.addEventListener('pointermove', e => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  track.style.transform = `translateX(${-current * getSlideWidth() + dx}px)`;
});
track.addEventListener('pointerup', e => {
  if (!isDragging) return;
  isDragging = false;
  track.style.transition = '';
  const dx = e.clientX - startX;
  if (dx < -60) goTo(current + 1);
  else if (dx > 60) goTo(current - 1);
  else goTo(current);
});

// keyboard nav
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') goTo(current + 1);
  if (e.key === 'ArrowLeft')  goTo(current - 1);
});

// init
goTo(0);

// recalc on resize
window.addEventListener('resize', () => goTo(current));