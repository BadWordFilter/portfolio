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
      const isOpen = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
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
      about_desc: `<strong>RAMIC STUDIO</strong>를 창업하여 이끌고 있는 대표, <strong>이학주</strong>입니다.<br><br>
                   저는 게임을 만들 때 <em>"왜 재미없는가"</em>를 먼저 묻습니다. 기획 의도를 정확히 파악한 뒤, 퍼포먼스 병목을 데이터로 측정하고 FSM·오브젝트 풀링 등 적합한 아키텍처를 선택해 문제를 해결합니다.<br><br>
                   메모리 프로파일링으로 GC Spike를 제거하거나, 셰이더 최적화로 드로우콜을 줄이는 것처럼 눈에 보이지 않는 영역까지 책임지며, 팀의 비전을 기술로 연결하여 하나의 '압도적인 세계'를 만드는 데 집중합니다.`,
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
      project1_summary: `<strong>[문제]</strong> 다양한 기믹을 가진 15개 퍼즐 스테이지를 전통적인 튜토리얼 없이 플레이어가 막히지 않고 몰입하게 만드는 것이 과제였습니다.<br><br>
                         <strong>[해결]</strong> AI 내러티브를 튜토리얼 대신 활용하고, 오브젝트별 FSM을 설계해 스테이지 전반의 기믹 일관성을 유지했습니다. 플레이 테스트 완주율 데이터로 난이도 곡선을 반복 조정하여 몰입감을 극대화했습니다.<br><br>
                         Steam / STOVE 출시`,
      project1_tag1: '액션 플랫포머',
      project1_tag2: 'FSM 오브젝트 설계',
      project1_tag3: '레벨 난이도 설계',
      project2_summary: `<strong>[문제]</strong> 23종의 해킹 퍼즐과 탄막 오브젝트를 동시에 처리할 때 드로우콜이 급증하여 프레임 드랍이 발생했습니다.<br><br>
                         <strong>[해결]</strong> 탄막 오브젝트를 오브젝트 풀링으로 전환하고 GPU 인스턴싱을 적용해 드로우콜을 절반 이하로 감소시켰습니다. Steam / STOVE 출시 후 <strong>2024년 12월 STOVE 상품 판매량 8위</strong>를 달성하였습니다.`,
      project2_tag1: '탄막 회피',
      project2_tag2: '캐주얼 퍼즐',
      project2_tag3: '레벨 디자인',
      project_award_name: '2025 SCHU AI·SW Festival 게임개발경진대회 - 최우수상 (MAYHEM)',
      project_award_summary: `<strong>[문제]</strong> 단순 킬 카운트 점수 방식으로는 전략적 플레이가 유도되지 않아 게임이 단조로웠습니다.<br><br>
                              <strong>[해결]</strong> 기존 방식 대신 멀티킬 보너스와 스타일 배율을 결합한 독창적 공식 <code>(킬 수 + Σ(멀티킬 수 - 1) × 스타일 점수)</code>를 설계하여 위험을 감수할수록 더 높은 점수를 얻는 전략적 긴장감을 구현했습니다.<br><br>
                              물리 기반 이동 시스템과의 시너지가 심사위원들의 극찬을 받아 <strong>최우수상</strong> 수상.`,
      video_mayhem1: 'MAYHEM 시연 영상 (1) &rarr;',
      video_mayhem2: 'MAYHEM 시연 영상 (2) &rarr;',
      view_certificate_schu: '상장 보기 (PDF) &rarr;',
      project3_name: 'FSM 기반 NPC AI 성능 비교 연구',
      project3_summary: `<strong>[문제]</strong> "FSM 기반 NPC AI는 개체 수가 늘어날수록 비효율적이다"는 통념이 있었지만, 이를 수치로 검증한 자료가 없었습니다.<br><br>
                         <strong>[검증]</strong> Unity 환경에서 NPC 개체 수를 10~500개 단위로 증가시키며 FPS 변화를 정밀 측정. 최적화된 FSM 아키텍처가 동일 조건에서 일반 구현 대비 유의미하게 높은 FPS를 유지함을 데이터로 입증하고 개선 모델을 제안했습니다.<br><br>
                         <strong>2025 한국디지털콘텐츠학회 하계종합학술대회 동상 수상</strong>`,
      read_paper: '논문 읽기 &rarr;',
      project_startup_name: '순천향대학교 제1회 로컬 창업동아리 아이디어 리그 경진대회 START-UP Track-1 - 은상 (Under-Shield)',
      project_startup_summary: `<strong>[문제]</strong> 전기차처럼 무게중심이 낮은 차량은 충돌 시 가드레일 하부로 파고드는 '언더라이드' 사고로 탑승자가 치명상을 입지만, 기존 가드레일 전면 교체 비용이 너무 높아 현실적 도입이 어려웠습니다.<br><br>
                               <strong>[해결]</strong> 기존 가드레일 하단에 볼트 체결만으로 부착 가능한 <strong>확장형 교통 안전 패널(A.U.P, Anti-Underride Panel)</strong>을 제안했습니다. 인프라 전면 교체 없이 최소 예산으로 안전망을 확보할 수 있어 B2G·B2B 시장 모두에 적용 가능한 솔루션입니다.<br><br>
                               순천향대학교 RISE사업단 주최 제1회 대회 START-UP Track-1 <strong>은상</strong> 수상.`,
      view_announcement: '공지사항 보기 &rarr;',
      project_glamp_name: '순천향대학교 G-LAMP 사업단 1기 LAMP 서포터즈',
      project_glamp_summary: `<strong>[역할]</strong> 순천향대학교 G-LAMP 사업단 1기 공식 홍보 서포터즈로 선정되어, 전문 연구 성과를 일반 대중이 이해할 수 있는 언어로 전달하는 과제를 맡았습니다.<br><br>
                            <strong>[기여]</strong> 카드뉴스·숏폼 영상 등 SNS 채널에 최적화된 포맷을 직접 기획·제작하여, 기초과학 콘텐츠의 접근성을 높이고 대중과 학계 사이의 가교 역할을 수행했습니다.`,
      project_glamp_tag1: '홍보 서포터즈',
      project_glamp_tag2: '콘텐츠 기획·제작',
      project_glamp_tag3: '기초과학 대중화',
      project_glamp_tag4: 'SNS 마케팅',
      nav_open: '메뉴 열기',
      nav_activities: 'Activities',
      activities_title: 'Activities',
      activities_oncampus: '교내 활동',
      activities_offcampus: '교외 활동',
      status_current: '진행 중',
      status_past: '완료',
      activity_crc_title: 'CRC 센터 기능팀 인턴',
      activity_crc_desc: '순천향대학교 CRC 센터 기능팀에서 인턴으로 근무하며 실무 역량을 쌓고 있습니다.',
      activity_crc_tag1: '기능팀',
      activity_crc_tag2: '실무 인턴십',
      activity_rep2_title: '메타버스&게임학과 2학년 과대표 · 법제사법위원회 위원장',
      activity_rep2_desc: '학과 2학년 대표로서 학생과 학교를 잇는 가교 역할을 수행하며, 동시에 법제사법위원회 위원장으로서 학생 자치 규정 및 안건을 심의·의결합니다.',
      activity_rep2_tag1: '학생 대표',
      activity_rep2_tag2: '학생 자치',
      activity_rep2_tag3: '규정 심의',
      activity_rep1_title: '메타버스&게임학과 1학년 과대표',
      activity_rep1_desc: '학과 신입생을 대표하여 학생 자치 활동에 참여하고 학과 행사 및 소통을 주도했습니다.',
      activity_rep1_tag1: '학생 대표',
      activity_rep1_tag2: '학생 자치',
      activity_glamp_title: '순천향대학교 G-LAMP 1기 LAMP 서포터즈',
      activity_glamp_desc: '<strong>[역할]</strong> G-LAMP 사업단 1기 공식 홍보 서포터즈.<br><strong>[기여]</strong> 카드뉴스·숏폼 영상 등 SNS 최적화 콘텐츠를 기획·제작하여 기초과학을 대중과 연결.',
      activity_glamp_tag1: '홍보 서포터즈',
      activity_glamp_tag2: '콘텐츠 기획·제작',
      activity_glamp_tag3: '기초과학 대중화',
      activity_startup_title: '제1회 로컬 창업동아리 아이디어 리그 START-UP Track-1 — 은상',
      activity_startup_desc: '<strong>[문제]</strong> 전기차 언더라이드 사고 위험 + 높은 가드레일 교체 비용.<br><strong>[해결]</strong> 볼트 체결 방식 확장형 교통 안전 패널(A.U.P)로 최소 예산 해결책 제안 → <strong>은상</strong> 수상.',
      activity_startup_tag: '창업 아이디어',
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
      about_desc: `I'm <strong>Hakju Lee</strong>, founder and CEO of <strong>RAMIC STUDIO</strong>.<br><br>
                   When building games, I start by asking <em>"Why isn't it fun?"</em> — then measure performance bottlenecks with data and choose the right architecture (FSM, Object Pooling, GPU Instancing) to fix the actual problem.<br><br>
                   From eliminating GC spikes via memory profiling to reducing draw calls through shader optimization, I take responsibility for what users don't see — so what they do see feels truly alive.`,
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
      project1_summary: `<strong>[Problem]</strong> How do you keep players immersed across 15 stages with wildly different gimmicks — without a traditional tutorial breaking the flow?<br><br>
                         <strong>[Solution]</strong> Replaced tutorials with in-universe AI narrative guidance and designed per-object FSMs to maintain gimmick consistency. Iteratively tuned difficulty curves using playtest completion-rate data. Released on Steam / STOVE.`,
      project1_tag1: 'Action Platformer',
      project1_tag2: 'FSM Object Architecture',
      project1_tag3: 'Difficulty Curve Design',
      project2_summary: `<strong>[Problem]</strong> Rendering 23 hacking-puzzle types simultaneously with bullet swarms caused draw call spikes and frame drops.<br><br>
                         <strong>[Solution]</strong> Migrated bullet objects to an Object Pool and applied GPU Instancing — cutting draw calls by more than half. Post-launch, the game hit <strong>8th place in STOVE's monthly sales ranking (Dec 2024)</strong>.`,
      project2_tag1: 'Bullet Hell',
      project2_tag2: 'Casual Puzzle',
      project2_tag3: 'Level Design',
      project_award_name: '2025 SCHU AI·SW Festival Game Development - Grand Prize (MAYHEM)',
      project_award_summary: `<strong>[Problem]</strong> A simple kill-count score system failed to incentivize risky, skillful play — making the game feel shallow.<br><br>
                              <strong>[Solution]</strong> Designed a custom scoring formula <code>(Kills + Σ(Multi-kills − 1) × Style Score)</code> that rewards risk-taking, creating meaningful strategic tension. Combined with physics-based movement, the system earned the jury's praise and the <strong>Grand Prize</strong>.`,
      video_mayhem1: 'MAYHEM Demo (1) &rarr;',
      video_mayhem2: 'MAYHEM Demo (2) &rarr;',
      view_certificate_schu: 'View Certificate (PDF) &rarr;',
      project3_name: 'Comparative Study on NPC AI Performance using FSM',
      project3_summary: `<strong>[Problem]</strong> Many developers assumed FSM-based NPC AI was inherently inefficient at scale — but no quantitative evidence existed to support or refute this.<br><br>
                         <strong>[Verification]</strong> Measured FPS across 10–500 NPC instances in Unity, proving that an optimized FSM architecture maintains significantly higher framerates than a naive implementation. Proposed a concrete improvement model backed by empirical data.<br><br>
                         <strong>Bronze Prize — 2025 DCS Summer Academic Conference</strong>`,
      read_paper: 'Read Paper &rarr;',
      project_startup_name: 'SCH 1st Local Startup Club Idea League - START-UP Track-1 Silver Prize (Under-Shield)',
      project_startup_summary: `<strong>[Problem]</strong> EVs and low-CoG vehicles face a fatal underride risk in collisions. Full guardrail replacement costs make safety upgrades impractical for most municipalities.<br><br>
                               <strong>[Solution]</strong> Proposed the <strong>Anti-Underride Panel (A.U.P)</strong> — a bolt-on extension to existing guardrails that blocks underride without infrastructure replacement. A B2G / B2B-ready solution that achieves modern safety standards at a fraction of the cost.<br><br>
                               Awarded the <strong>Silver Prize</strong> at the 1st SCH Local Startup Club Idea League, START-UP Track-1.`,
      view_announcement: 'View Announcement &rarr;',
      project_glamp_name: 'Soonchunhyang University G-LAMP 1st LAMP Supporters',
      project_glamp_summary: `<strong>[Role]</strong> Selected as an official PR Supporter for the SCH G-LAMP project group, tasked with translating specialist research into content accessible to a general audience.<br><br>
                            <strong>[Contribution]</strong> Planned and produced SNS-optimized formats (card news, short-form video) to increase public engagement with basic science content, bridging the gap between academia and the public.`,
      project_glamp_tag1: 'PR Supporters',
      project_glamp_tag2: 'Content Strategy & Production',
      project_glamp_tag3: 'Science Communication',
      project_glamp_tag4: 'SNS Marketing',
      nav_open: 'Open Menu',
      nav_activities: 'Activities',
      activities_title: 'Activities',
      activities_oncampus: 'On-Campus',
      activities_offcampus: 'Off-Campus',
      status_current: 'Current',
      status_past: 'Completed',
      activity_crc_title: 'CRC Center — Functional Team Intern',
      activity_crc_desc: 'Working as an intern at the CRC Center\'s functional team at Soonchunhyang University, building hands-on professional experience.',
      activity_crc_tag1: 'Functional Team',
      activity_crc_tag2: 'Internship',
      activity_rep2_title: 'Metaverse & Game Dept. 2nd Year Class Representative · Chair, Legislative & Judiciary Committee',
      activity_rep2_desc: 'Serving as the 2nd-year class representative and simultaneously chairing the Legislative & Judiciary Committee, reviewing and deliberating on student governance regulations and agenda items.',
      activity_rep2_tag1: 'Class Rep',
      activity_rep2_tag2: 'Student Governance',
      activity_rep2_tag3: 'Policy Review',
      activity_rep1_title: 'Metaverse & Game Dept. 1st Year Class Representative',
      activity_rep1_desc: 'Represented the first-year students in self-governance activities and led department events and communications.',
      activity_rep1_tag1: 'Class Rep',
      activity_rep1_tag2: 'Student Governance',
      activity_glamp_title: 'SCH G-LAMP 1st LAMP Supporters',
      activity_glamp_desc: '<strong>[Role]</strong> Official PR Supporter for the G-LAMP 1st cohort.<br><strong>[Contribution]</strong> Planned & produced SNS-optimized content (card news, short-form video) to bridge basic science research and the public.',
      activity_glamp_tag1: 'PR Supporters',
      activity_glamp_tag2: 'Content Strategy & Production',
      activity_glamp_tag3: 'Science Communication',
      activity_startup_title: '1st Local Startup Club Idea League START-UP Track-1 — Silver Prize',
      activity_startup_desc: '<strong>[Problem]</strong> EV underride accident risk + prohibitively high guardrail replacement costs.<br><strong>[Solution]</strong> Proposed A.U.P bolt-on panel to achieve modern safety at minimal cost → Awarded <strong>Silver Prize</strong>.',
      activity_startup_tag: 'Startup Idea',
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
    document.documentElement.lang = lang;

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

    // Update aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.dataset.i18nAria;
      if (translations[lang][key]) {
        el.setAttribute('aria-label', translations[lang][key]);
      }
    });

    // Reset roles for typewriter
    roles = translations[lang].roles;
    roleIdx = 0;
    charIdx = 0;
    isDeleting = false;
    clearTimeout(typeWriterTimeout);
    typeWriter();
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
  let typeWriterTimeout = null;
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
    typeWriterTimeout = setTimeout(typeWriter, delay);
  }

  // Initialize with saved language
  updateLanguage(currentLang);

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

      btn.textContent = 'Sending…';
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
