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
  const navLinks = document.querySelector('.nav-links');

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

  // ── i18n (Internationalization) ────────────────────────
  const translations = {
    ko: {
      nav_about: 'About',
      nav_expertise: 'Expertise',
      nav_work: 'Work',
      nav_contact: 'Contact',
      hero_eyebrow: 'Portfolio 2026',
      hero_title: 'Hakju<br>Lee.',
      hero_subtitle: 'Meticulous Engineering meets Elegant Design.',
      about_title: 'About Me',
      about_desc: `플레이어의 몰입감과 경험을 최우선으로 생각하며 <strong>RAMIC STUDIO</strong>를 창업하여 이끌고 있는 대표, <strong>이학주</strong>입니다.<br><br>
                   기획의 의도를 정확하게 파악하고, 이를 극한의 성능과 단단한 아키텍처로 구현해내는 데 자부심을 느낍니다.
                   눈에 보이지 않는 최적화부터 화면 속 생동감 넘치는 연출까지, 팀의 비전을 기술로 연결하여 하나의 '압도적인 세계'를 만드는 데 집중하고 있습니다.`,
      about_info_name: 'Name',
      about_info_name_val: '이학주 (Founder & CEO, RAMIC STUDIO)',
      about_info_location: 'Location',
      about_info_location_val: '대한민국 인천',
      skills_title: 'Expertise',
      skill_game_engine: 'Game Engine',
      skill_visual: 'Visual & Tech Art',
      skill_tools: 'Tools & Methods',
      skill_languages: 'Programming Languages',
      projects_title: 'Selected Work',
      skill_modeling: '3D 모델링',
      skill_texturing: 'PBR 텍스처링',
      skill_vfx: '셰이더 & VFX',
      skill_profiling: '메모리 프로파일링',
      project1_summary: '기억을 잃은 연구 시설에서 AI의 지시에 따라 다양한 기믹의 15개 퍼즐 스테이지를 돌파하는 액션 플랫포머 게임입니다. (Steam / STOVE 출시)',
      project1_tag1: '액션 플랫포머',
      project1_tag2: '퍼즐',
      project1_tag3: '레벨 디자인',
      project2_summary: '정부 소속 서버를 방어하기 위해 23종의 해킹 퍼즐 및 선 잇기를 해결하며 장애물을 피하는 긴장감 넘치는 탄막 회피 게임입니다. (Steam / STOVE 출시)',
      project2_tag1: '탄막 회피',
      project2_tag2: '캐주얼 퍼즐',
      project2_tag3: '레벨 디자인',
      project_award_name: '2025 SCHU AI·SW Festival 게임개발경진대회 - 최우수상 (MAYHEM)',
      project_award_summary: `사각형 케이지 안에서 2분 동안 7종류의 적을 처치하며 최고 점수를 겨루는 2D 아케이드 액션 게임 <strong>'MAYHEM'</strong>으로 <strong>최우수상</strong>을 수상하였습니다. 
                              물리 기반 이동과 독창적인 점수 공식 <code>(킬 수 + Σ(멀티킬 수 - 1) * 스타일 점수)</code>을 활용한 전략적 콤보 시스템으로 심사위원들의 극찬을 받으며 기술력과 독창성을 인정받았습니다.`,
      video_mayhem1: 'MAYHEM 시연 영상 (1) &rarr;',
      video_mayhem2: 'MAYHEM 시연 영상 (2) &rarr;',
      view_certificate_schu: '상장 보기 (PDF) &rarr;',
      project3_name: 'FSM 기반 NPC AI 성능 비교 연구',
      project3_summary: `Unity 엔진에서 FSM(유한 상태 기계)을 활용한 NPC AI의 성능을 정량적으로 분석하고 최적화 방안을 제시한 연구입니다.
                         객체 수 증가에 따른 FPS 변화를 정밀하게 측정하여 FSM의 효율성을 입증하였으며,
                         <strong>2025 한국디지털콘텐츠학회 하계종합학술대회</strong>에서 기술적 완성도를 인정받아 <strong>동상</strong>을 수상하였습니다.`,
      read_paper: '논문 읽기 &rarr;',
      contact_title: 'Get in Touch',
      contact_desc: '새로운 기회와 혁신적인 프로젝트 제안을 언제나 환영합니다.<br>아래 폼을 통해 메시지를 남겨주시거나 이메일로 연락주세요.',
      send_message: '메시지 전송',
      form_success: '메시지가 성공적으로 전송되었습니다.',
      roles: ['Founder & CEO, RAMIC STUDIO', 'Game Developer', 'Gameplay Programmer', 'Creative Visionary', 'World Builder']
    },
    en: {
      nav_about: 'About',
      nav_expertise: 'Expertise',
      nav_work: 'Work',
      nav_contact: 'Contact',
      hero_eyebrow: 'Portfolio 2026',
      hero_title: 'Hakju<br>Lee.',
      hero_subtitle: 'Meticulous Engineering meets Elegant Design.',
      about_title: 'About Me',
      about_desc: `As the founder and CEO of <strong>RAMIC STUDIO</strong>, I, <strong>Hakju Lee</strong>, prioritize player immersion and experience above all else.<br><br>
                   I take pride in accurately understanding planning intent and implementing it with extreme performance and solid architecture.
                   From invisible optimizations to vivid on-screen productions, I focus on connecting the team's vision through technology to create a single 'overwhelming world.'`,
      about_info_name: 'Name',
      about_info_name_val: 'Hakju Lee (Founder & CEO, RAMIC STUDIO)',
      about_info_location: 'Location',
      about_info_location_val: 'Incheon, Korea',
      skills_title: 'Expertise',
      skill_game_engine: 'Game Engine',
      skill_visual: 'Visual & Tech Art',
      skill_tools: 'Tools & Methods',
      skill_languages: 'Programming Languages',
      projects_title: 'Selected Work',
      skill_modeling: '3D Modeling',
      skill_texturing: 'PBR Texturing',
      skill_vfx: 'Shader & VFX',
      skill_profiling: 'Memory Profiling',
      project1_summary: 'An action platformer where you break through 15 puzzle stages with various gimmicks following AI instructions in a memory-lost research facility. (Released on Steam / STOVE)',
      project1_tag1: 'Action Platformer',
      project1_tag2: 'Puzzle',
      project1_tag3: 'Level Design',
      project2_summary: 'A high-tension bullet-hell game where you solve 23 types of hacking puzzles and connect lines while avoiding obstacles to defend government servers. (Released on Steam / STOVE)',
      project2_tag1: 'Bullet Hell',
      project2_tag2: 'Casual Puzzle',
      project2_tag3: 'Level Design',
      project_award_name: '2025 SCHU AI·SW Festival Game Development - Grand Prize (MAYHEM)',
      project_award_summary: `Awarded the <strong>Grand Prize</strong> for <strong>'MAYHEM'</strong>, a 2D arcade action game where players compete for the highest score by defeating 7 types of enemies in a square cage within 2 minutes.
                              Recognized for its technical excellence and originality, particularly for its physics-based movement and strategic combo system using a unique scoring formula <code>(Kills + Σ(Multi-kills - 1) * Style Score)</code>.`,
      video_mayhem1: 'MAYHEM Demo (1) &rarr;',
      video_mayhem2: 'MAYHEM Demo (2) &rarr;',
      view_certificate_schu: 'View Certificate (PDF) &rarr;',
      project3_name: 'Comparative Study on NPC AI Performance using FSM',
      project3_summary: `This study quantitatively analyzed the performance of NPC AI using FSM (Finite State Machine) in the Unity engine and proposed optimization methods.
                         By precisely measuring FPS changes according to the increase in the number of objects, the efficiency of FSM was proven.
                         Technological completeness was recognized with a <strong>Bronze Prize</strong> at the <strong>2025 Digital Content Society (DCS) Summer Conference</strong>.`,
      read_paper: 'Read Paper &rarr;',
      contact_title: 'Get in Touch',
      contact_desc: 'I always welcome new opportunities and innovative project proposals.<br>Please leave a message through the form below or contact me via email.',
      send_message: 'Send Message',
      form_success: 'Message sent successfully.',
      roles: ['Founder & CEO, RAMIC STUDIO', 'Game Developer', 'Gameplay Programmer', 'Creative Visionary', 'World Builder']
    }
  };

  let currentLang = localStorage.getItem('preferredLang') || 'ko';

  function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLang', lang);

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Reset roles for typewriter
    roles = translations[lang].roles;
    roleIdx = 0;
    charIdx = 0;
    isDeleting = false;
  }

  // Language button event listeners
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.lang !== currentLang) {
        updateLanguage(btn.dataset.lang);
      }
    });
  });

  // ── Typewriter effect ────────────────────────────────
  let roles = translations[currentLang].roles;
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

  // Initialize with saved language
  updateLanguage(currentLang);
  typeWriter();

  // ── Scroll reveal (Intersection Observer) ─────────────
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

        // 스킬 섹션 혹은 그 하위 요소가 보일 때 애니메이션 실행
        if (entry.target.id === 'skills' || entry.target.closest('#skills')) {
          animateSkillBars();
        }

        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-bar-fill');
    if (fills.length === 0) return;

    fills.forEach(fill => {
      const percent = fill.getAttribute('data-percent');
      // 이미 애니메이션이 진행 중이지 않을 때만 실행
      if (fill.style.width !== percent + '%') {
        setTimeout(() => {
          fill.style.width = percent + '%';
        }, 100);
      }
    });
  }

  // 초기 로드 시 이미 스킬 섹션이 보이고 있을 수 있으므로 체크
  window.animateSkillBars = animateSkillBars;

  revealEls.forEach(el => observer.observe(el));

  // ── Active nav link highlight ────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a');

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
  const form = document.getElementById('contact-form');
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
