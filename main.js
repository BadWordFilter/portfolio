/* ============================
   JS: main.js (The Editorial Canvas)
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ─────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ── Hamburger menu ───────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ── Typewriter effect ────────────────────────────────
  const roles = [
    'Game Developer',
    'Gameplay Programmer',
    'Creative Visionary',
    'World Builder'
  ];
  let roleIdx = 0, charIdx = 0, isDeleting = false;
  const roleEl = document.getElementById('role-text');

  function typeWriter() {
    if (!roleEl) return;
    const current = roles[roleIdx];
    
    if (isDeleting) {
      roleEl.textContent = current.slice(0, --charIdx);
    } else {
      roleEl.textContent = current.slice(0, ++charIdx);
    }

    let delay = isDeleting ? 40 : 120; // 타이핑은 약간 여유 있게

    if (!isDeleting && charIdx === current.length) {
      delay = 2000; // 완성 후 대기 시간 길게 (우아함 유지)
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 500;
    }
    setTimeout(typeWriter, delay);
  }
  typeWriter();

  // ── Scroll reveal (Intersection Observer) ─────────────
  // 모든 .reveal 요소를 화면 15% 정도 진입했을 때 서서히 나타나게 함
  const revealEls = document.querySelectorAll('.reveal');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // 한 번 보여주면 다시 숨기지 않음 (성능 최적화)
      }
    });
  }, observerOptions);

  revealEls.forEach(el => observer.observe(el));

  // ── Active nav link highlight ────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    // 요소가 화면의 3분의 1 지점에 걸릴 때 활성화된 것으로 간주
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop;
      if (window.scrollY >= sectionTop - window.innerHeight / 3) {
        current = sec.getAttribute('id');
      }
    });

    navAs.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }, { passive: true });

  // ── Contact form (demo) ──────────────────────────────
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      const originalBtnText = btn.textContent;
      
      btn.textContent = 'Sending...';
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.7';

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          success.classList.add('show');
          form.reset();
        } else {
          alert('Oops! There was a problem submitting your form');
        }
      } catch (error) {
        alert('Oops! There was a problem submitting your form');
      } finally {
        btn.textContent = originalBtnText;
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
        
        setTimeout(() => {
          success.classList.remove('show');
        }, 5000);
      }
    });
  }

});
