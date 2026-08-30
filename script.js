(() => {
  const boot = document.getElementById('boot');
  const startBtn = document.getElementById('startBtn');
  const coinCount = document.getElementById('coinCount');
  const worldLabel = document.getElementById('worldLabel');
  const worldLinks = [...document.querySelectorAll('.world-nav a[data-world]')];
  const weekSections = [...document.querySelectorAll('.week[data-world]')];
  const toast = document.getElementById('toast');
  const soundBtn = document.getElementById('soundBtn');
  const printBtn = document.getElementById('printBtn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const closeLightbox = document.getElementById('closeLightbox');
  const visited = new Set();
  let soundOn = true;
  let audioCtx = null;

  function tone(freq = 650, duration = .08, type = 'square', gainValue = .035) {
    if (!soundOn) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + duration);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
  }

  function coinSound() {
    tone(880, .07, 'square', .035);
    setTimeout(() => tone(1320, .09, 'square', .03), 70);
  }

  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 1600);
  }

  startBtn?.addEventListener('click', () => {
    tone(440, .09);
    setTimeout(() => tone(660, .12), 80);
    boot.classList.add('is-hidden');
    boot.setAttribute('aria-hidden', 'true');
    setTimeout(() => boot.remove(), 650);
  });

  document.querySelectorAll('.question-reveal').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.reveal);
      if (!target) return;
      target.hidden = !target.hidden;
      tone(target.hidden ? 300 : 720, .08);
      btn.setAttribute('aria-expanded', String(!target.hidden));
    });
  });

  document.querySelectorAll('.evidence-image').forEach(btn => {
    btn.addEventListener('click', () => {
      lightboxImage.src = btn.dataset.image;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      tone(520, .06, 'sine');
    });
  });
  function closeBox() {
    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.style.overflow = '';
  }
  closeLightbox?.addEventListener('click', closeBox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeBox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.hidden) closeBox(); });

  soundBtn?.addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? '🔊' : '🔇';
    if (soundOn) tone(700, .06);
  });
  printBtn?.addEventListener('click', () => window.print());

  function setActive(world) {
    worldLinks.forEach(a => a.classList.toggle('active', a.dataset.world === String(world)));
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const section = entry.target;
      const name = section.dataset.worldName || 'PORTAFOLIO';
      worldLabel.textContent = name;
      if (section.dataset.world) {
        const w = Number(section.dataset.world);
        setActive(w);
        if (!visited.has(w)) {
          visited.add(w);
          coinCount.textContent = visited.size;
          coinSound();
          showToast(`🪙 ¡Moneda ${w}/8 obtenida!`);
        }
      } else {
        setActive(0);
      }
    });
  }, { rootMargin: '-38% 0px -52% 0px', threshold: 0 });

  document.querySelectorAll('.game-section').forEach(section => observer.observe(section));

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => tone(470, .045, 'square', .02));
  });
})();
