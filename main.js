/* ============================================================
   main.js — "Obsidian Atelier"
   GSAP (ScrollTrigger · SplitText) · anime.js v4 · Lenis · silk.js
   Everything degrades: no lib → content simply shows.
   ============================================================ */
(function () {
  'use strict';

  /* ── Config ─────────────────────────────────────────── */
  const CONFIG = {
    // Paste a Spline scene URL here to replace the WebGL silk with a Spline 3D scene, e.g.
    // 'https://prod.spline.design/XXXXXXXX/scene.splinecode'
    splineScene: '',
    splineViewer: 'https://unpkg.com/@splinetool/viewer@1.10.65/build/spline-viewer.js',
    silkColors: ['#050507', '#0E0C12', '#2A2017', '#D9B87A'],
    navOffset: -72
  };

  const html = document.documentElement;
  const body = document.body;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const osReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let motionOff = false;
  try { motionOff = localStorage.getItem('motionOff') === '1'; } catch (e) { /* storage blocked */ }
  const reduceMotion = osReducedMotion || motionOff;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  const hasSplit = hasGSAP && typeof window.SplitText !== 'undefined';
  const hasAnime = typeof window.anime !== 'undefined' && typeof window.anime.animate === 'function';
  const hasLenis = typeof window.Lenis !== 'undefined';

  if (reduceMotion) html.classList.add('reduce-motion');
  if (hasGSAP) {
    const plugins = [];
    if (hasST) plugins.push(ScrollTrigger);
    if (hasSplit) plugins.push(SplitText);
    if (plugins.length) gsap.registerPlugin.apply(gsap, plugins);
    gsap.defaults({ ease: 'power3.out', overwrite: 'auto' });
  }

  /* ── i18n ───────────────────────────────────────────── */
  const translations = {
    ko: {
      skip_link: '본문으로 건너뛰기',
      nav_about: 'About',
      nav_expertise: 'Expertise',
      nav_experience: 'Experience',
      nav_work: 'Work',
      nav_activities: 'Activities',
      nav_contact: 'Contact',
      nav_open: '메뉴 열기',
      nav_close: '메뉴 닫기',
      nav_menu: '메뉴',
      aria_home: 'Hakju Lee — 홈으로',
      aria_main_nav: '주요 메뉴',
      aria_lang: '언어 선택',
      aria_scroll: '아래로 스크롤',
      aria_summary: '요약',
      aria_tech_filter: '기술 필터',
      scroll_cue: 'Scroll',
      hero_eyebrow: 'Portfolio 2026',
      hero_subtitle: 'Meticulous Engineering meets Elegant Design.',
      about_title: 'About Me',
      about_desc: `고등학교 2학년부터 <strong>RAMIC STUDIO</strong>를 창업하여 기획·개발·Steam·STOVE 출시까지 <em>풀 사이클(Full-cycle)</em>을 직접 경험하며 대표로서 성장해 온 <strong>이학주</strong>입니다.<br><br>
                   게임을 만들 때 <em>"왜 재미없는가"</em>를 먼저 묻습니다. 퍼포먼스 병목을 데이터로 측정하고 FSM·오브젝트 풀링 등 적합한 아키텍처로 문제를 해결합니다. 이 접근법은 FSM 기반 NPC AI 성능을 정량 분석한 학술 연구로도 이어져 <strong>한국디지털콘텐츠학회 동상</strong>을 수상했습니다.<br><br>
                   눈에 보이지 않는 최적화부터 시장에서 검증된 출시 경험까지 — 기술과 비즈니스 양쪽을 잇는 개발자입니다.`,
      about_info_name: 'Name',
      about_info_name_val: '이학주 (Founder & CEO, RAMIC STUDIO)',
      about_info_location: 'Location',
      about_info_location_val: '대한민국 인천',
      alt_profile: '이학주 프로필 사진',
      stat_titles: '출시 타이틀 (Steam · STOVE)',
      stat_rank: 'STOVE 판매 순위 (2024.12)',
      stat_awards: '수상 (최우수 · 동상 · 은상)',
      stat_since: 'RAMIC STUDIO 설립',
      skills_title: 'Expertise',
      skills_filter_hint: '태그를 클릭하면 해당 기술이 쓰인 프로젝트만 표시됩니다.',
      filter_shown: '{n}개의 프로젝트를 표시합니다.',
      skill_game_engine: 'Game Engine',
      skill_visual: 'Visual & Tech Art',
      skill_tools: 'Tools & Methods',
      skill_languages: 'Programming Languages',
      skill_modeling: '3D 모델링',
      skill_texturing: 'PBR 텍스처링',
      skill_vfx: '셰이더 & VFX',
      skill_profiling: '메모리 프로파일링',
      exp_title: 'Experience & Leadership',
      exp_ramic_desc: '고등학교 2학년부터 스튜디오를 설립하여 <strong>기획 → 개발 → 퍼블리싱</strong>까지 풀 사이클을 직접 운영하고 있습니다. Steam &amp; STOVE에 상업 게임 2편을 출시하였으며, 매출 데이터와 유저 피드백을 기반으로 업데이트 주기를 관리합니다.',
      exp_ramic_link: 'Steam 스토어',
      exp_malgeum_desc: '수제 키캡 브랜드 <strong>맑음(MALGEUM)</strong>을 창업하여 브랜딩, 제품 기획, 온라인 마케팅 전반을 총괄합니다. 개발자 관점에서 브랜드 웹사이트를 직접 구축하고 고객 경험 설계부터 론칭 전략까지 이끌고 있습니다.',
      exp_hmbg_title: 'HMBG 햄부기 게임개발동아리',
      exp_hmbg_desc: '<strong>단순 학습을 넘어 실제 시장에 출시</strong>하는 것을 목표로 동아리를 이끌고 있습니다. 회장의 Steam/STOVE 출시 노하우를 공유하는 퍼블리싱 멘토링, 분기별 빌드 데이, 신입생 대상 파이썬 튜터링을 운영합니다. 2025 SCHU AI·SW Festival 최우수상 수상 프로젝트(MAYHEM)를 함께 제작했습니다.',
      projects_title: 'Selected Work',
      badge_new: 'Beta 2025.05',
      badge_stove8: 'STOVE 판매량 8위',
      project_nplh_summary: '<strong>[문제]</strong> 5일 밤 동안 유령의 공격을 막아내며 생존하는 서바이벌 호러 게임. 협업 개발자 Ce_r4mic과 함께 제작하였습니다.<br><br><strong>[기술]</strong> Unity + C#으로 개발. 유령 AI 행동 패턴을 FSM으로 설계하여 밤마다 점층적 위협 강도를 구현하였습니다.',
      project1_summary: `<strong>[문제]</strong> 다양한 기믹을 가진 15개 퍼즐 스테이지를 전통적인 튜토리얼 없이 플레이어가 막히지 않고 몰입하게 만드는 것이 과제였습니다.<br><br>
                         <strong>[해결]</strong> AI 내러티브를 튜토리얼 대신 활용하고, 오브젝트별 FSM을 설계해 스테이지 전반의 기믹 일관성을 유지했습니다. 플레이 테스트 완주율 데이터로 난이도 곡선을 반복 조정하여 몰입감을 극대화했습니다.<br><br>
                         Steam / STOVE 출시`,
      project1_tag1: '액션 플랫포머',
      project1_tag2: 'FSM 오브젝트 설계',
      project1_tag3: '레벨 난이도 설계',
      alt_genesis: 'PROJECT : GENESIS 게임 캐릭터 픽셀 아트',
      project2_summary: `<strong>[문제]</strong> 23종의 해킹 퍼즐과 탄막 오브젝트를 동시에 처리할 때 드로우콜이 급증하여 프레임 드랍이 발생했습니다.<br><br>
                         <strong>[해결]</strong> 탄막 오브젝트를 오브젝트 풀링으로 전환하고 GPU 인스턴싱을 적용해 드로우콜을 절반 이하로 감소시켰습니다. Steam / STOVE 출시 후 <strong>2024년 12월 STOVE 상품 판매량 8위</strong>를 달성하였습니다.`,
      project2_tag1: '탄막 회피',
      project2_tag2: '캐주얼 퍼즐',
      project2_tag3: '레벨 디자인',
      alt_hacking: 'Hack.ing 게임 아이콘',
      project3_name: 'FSM 기반 NPC AI 성능 비교 연구',
      project3_summary: `<strong>[문제]</strong> "FSM 기반 NPC AI는 개체 수가 늘어날수록 비효율적이다"는 통념이 있었지만, 이를 수치로 검증한 자료가 없었습니다.<br><br>
                         <strong>[검증]</strong> Unity 환경에서 NPC 개체 수를 10~500개 단위로 증가시키며 FPS 변화를 정밀 측정. 최적화된 FSM 아키텍처가 동일 조건에서 일반 구현 대비 유의미하게 높은 FPS를 유지함을 데이터로 입증하고 개선 모델을 제안했습니다.<br><br>
                         <strong>2025 한국디지털콘텐츠학회 하계종합학술대회 동상 수상</strong>`,
      read_paper: '논문 읽기',
      alt_paper: 'FSM NPC AI 논문 동상 상장',
      project_award_name: 'MAYHEM',
      project_award_badge: '최우수상',
      project_award_event: '2025 SCHU AI·SW Festival 게임개발경진대회',
      project_award_summary: `<strong>[문제]</strong> 단순 킬 카운트 점수 방식으로는 전략적 플레이가 유도되지 않아 게임이 단조로웠습니다.<br><br>
                              <strong>[해결]</strong> 기존 방식 대신 멀티킬 보너스와 스타일 배율을 결합한 독창적 공식 <code>(킬 수 + Σ(멀티킬 수 - 1) × 스타일 점수)</code>를 설계하여 위험을 감수할수록 더 높은 점수를 얻는 전략적 긴장감을 구현했습니다.<br><br>
                              물리 기반 이동 시스템과의 시너지가 심사위원들의 극찬을 받아 <strong>최우수상</strong> 수상.`,
      video_mayhem1: 'MAYHEM 시연 영상 (1)',
      video_mayhem2: 'MAYHEM 시연 영상 (2)',
      view_certificate_schu: '상장 보기 (PDF)',
      view_certificate: '상장 (PDF)',
      alt_schu: '2025 SCHU AI·SW Festival 최우수상 상장 (MAYHEM)',
      project_startup_name: 'Under-Shield',
      project_startup_badge: '은상',
      project_startup_event: '순천향대학교 제1회 로컬 창업동아리 아이디어 리그 경진대회 · START-UP Track-1',
      project_startup_summary: `<strong>[문제]</strong> 전기차처럼 무게중심이 낮은 차량은 충돌 시 가드레일 하부로 파고드는 '언더라이드' 사고로 탑승자가 치명상을 입지만, 기존 가드레일 전면 교체 비용이 너무 높아 현실적 도입이 어려웠습니다.<br><br>
                               <strong>[해결]</strong> 기존 가드레일 하단에 볼트 체결만으로 부착 가능한 <strong>확장형 교통 안전 패널(A.U.P, Anti-Underride Panel)</strong>을 제안했습니다. 인프라 전면 교체 없이 최소 예산으로 안전망을 확보할 수 있어 B2G·B2B 시장 모두에 적용 가능한 솔루션입니다.<br><br>
                               순천향대학교 RISE사업단 주최 제1회 대회 START-UP Track-1 <strong>은상</strong> 수상.`,
      view_announcement: '공지사항 보기',
      alt_silver: 'RAMIC STUDIO 은상 상장',
      project_glamp_name: '순천향대학교 G-LAMP 사업단 LAMP 서포터즈',
      project_glamp_summary: `<strong>[역할]</strong> 순천향대학교 G-LAMP 사업단 공식 홍보 서포터즈로 선정되어, 전문 연구 성과를 일반 대중이 이해할 수 있는 언어로 전달하는 과제를 맡았습니다.<br><br>
                            <strong>[기여]</strong> 카드뉴스·숏폼 영상 등 SNS 채널에 최적화된 포맷을 직접 기획·제작하여, 기초과학 콘텐츠의 접근성을 높이고 대중과 학계 사이의 가교 역할을 수행했습니다.`,
      project_glamp_tag1: '홍보 서포터즈',
      project_glamp_tag2: '콘텐츠 기획·제작',
      project_glamp_tag3: '기초과학 대중화',
      project_glamp_tag4: 'SNS 마케팅',
      alt_glamp: 'G-LAMP 서포터즈 비주얼',
      work_empty: '해당 기술로 진행한 프로젝트가 없습니다.',
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
      activity_glamp_title: '순천향대학교 G-LAMP LAMP 서포터즈',
      activity_glamp_desc: '<strong>[역할]</strong> G-LAMP 사업단 공식 홍보 서포터즈.<br><strong>[기여]</strong> 카드뉴스·숏폼 영상 등 SNS 최적화 콘텐츠를 기획·제작하여 기초과학을 대중과 연결.',
      activity_glamp_tag1: '홍보 서포터즈',
      activity_glamp_tag2: '콘텐츠 기획·제작',
      activity_glamp_tag3: '기초과학 대중화',
      activity_startup_title: '제1회 로컬 창업동아리 아이디어 리그 START-UP Track-1 — 은상',
      activity_startup_desc: '<strong>[문제]</strong> 전기차 언더라이드 사고 위험 + 높은 가드레일 교체 비용.<br><strong>[해결]</strong> 볼트 체결 방식 확장형 교통 안전 패널(A.U.P)로 최소 예산 해결책 제안 → <strong>은상</strong> 수상.',
      activity_startup_tag: '창업 아이디어',
      contact_title: 'Get in Touch',
      contact_desc: '새로운 기회와 혁신적인 프로젝트 제안을 언제나 환영합니다.<br>아래 폼을 통해 메시지를 남겨주시거나 이메일로 연락주세요.',
      send_message: '메시지 전송',
      form_sending: '전송 중…',
      form_success: '메시지가 성공적으로 전송되었습니다.',
      form_error: '전송에 실패했습니다. 잠시 후 다시 시도하거나 이메일로 연락해 주세요.',
      form_invalid: '입력하지 않은 항목이 있습니다.',
      err_required: '필수 입력 항목입니다.',
      err_email: '올바른 이메일 주소를 입력해 주세요.',
      footer_time: '인천',
      footer_top: '맨 위로',
      motion_off: '모션 끄기',
      motion_on: '모션 켜기',
      roles: ['Founder & CEO, RAMIC STUDIO', 'Game Developer', 'Gameplay Programmer', 'Creative Visionary', 'World Builder']
    },
    en: {
      skip_link: 'Skip to content',
      nav_about: 'About',
      nav_expertise: 'Expertise',
      nav_experience: 'Experience',
      nav_work: 'Work',
      nav_activities: 'Activities',
      nav_contact: 'Contact',
      nav_open: 'Open menu',
      nav_close: 'Close menu',
      nav_menu: 'Menu',
      aria_home: 'Hakju Lee — Home',
      aria_main_nav: 'Main menu',
      aria_lang: 'Language',
      aria_scroll: 'Scroll down',
      aria_summary: 'Summary',
      aria_tech_filter: 'Technology filter',
      scroll_cue: 'Scroll',
      hero_eyebrow: 'Portfolio 2026',
      hero_subtitle: 'Meticulous Engineering meets Elegant Design.',
      about_title: 'About Me',
      about_desc: `Founded <strong>RAMIC STUDIO</strong> in high school and have grown as CEO, directly experiencing the full cycle — planning, development, Steam &amp; STOVE publishing.<br><br>
                   When building games, I start by asking <em>"Why isn't it fun?"</em> — then measure performance bottlenecks with data and choose the right architecture (FSM, Object Pooling) to fix the actual problem. This approach led to an academic study on FSM-based NPC AI performance, earning a <strong>Bronze Prize at the DCS Summer Conference</strong>.<br><br>
                   From invisible optimizations to market-validated shipping experience — a developer who bridges both technology and business.`,
      about_info_name: 'Name',
      about_info_name_val: 'Hakju Lee (Founder & CEO, RAMIC STUDIO)',
      about_info_location: 'Location',
      about_info_location_val: 'Incheon, Korea',
      alt_profile: 'Portrait of Hakju Lee',
      stat_titles: 'Shipped Titles (Steam · STOVE)',
      stat_rank: 'STOVE Sales Rank (Dec 2024)',
      stat_awards: 'Awards (Grand · Bronze · Silver)',
      stat_since: 'RAMIC STUDIO Founded',
      skills_title: 'Expertise',
      skills_filter_hint: 'Click a tag to filter projects by technology.',
      filter_shown: 'Showing {n} projects.',
      skill_game_engine: 'Game Engine',
      skill_visual: 'Visual & Tech Art',
      skill_tools: 'Tools & Methods',
      skill_languages: 'Programming Languages',
      skill_modeling: '3D Modeling',
      skill_texturing: 'PBR Texturing',
      skill_vfx: 'Shader & VFX',
      skill_profiling: 'Memory Profiling',
      exp_title: 'Experience & Leadership',
      exp_ramic_desc: 'Founded the studio in high school and have been operating the full cycle — <strong>planning → development → publishing</strong> — ever since. Released 2 commercial games on Steam &amp; STOVE, managing update cadence based on sales data and user feedback.',
      exp_ramic_link: 'Steam Store',
      exp_malgeum_desc: 'Founded <strong>MALGEUM</strong>, a handcrafted keycap brand, overseeing branding, product planning, and online marketing. Built the brand website from scratch as a developer and leads everything from customer experience design to launch strategy.',
      exp_hmbg_title: 'HMBG Game Dev Club',
      exp_hmbg_desc: 'Leading the club with a goal of <strong>shipping real games to market</strong>, not just learning. Runs publishing mentoring (sharing Steam/STOVE release know-how), quarterly build days, and Python tutoring for freshmen. Co-created MAYHEM, the Grand Prize project at the 2025 SCHU AI·SW Festival.',
      projects_title: 'Selected Work',
      badge_new: 'Beta 2025.05',
      badge_stove8: 'STOVE Sales Rank #8',
      project_nplh_summary: '<strong>[Concept]</strong> A survival horror game where you must endure 5 nights of ghost attacks. Built in collaboration with Ce_r4mic.<br><br><strong>[Tech]</strong> Developed in Unity + C#. Ghost AI behavior patterns designed with FSM to deliver escalating threat intensity each night.',
      project1_summary: `<strong>[Problem]</strong> How do you keep players immersed across 15 stages with wildly different gimmicks — without a traditional tutorial breaking the flow?<br><br>
                         <strong>[Solution]</strong> Replaced tutorials with in-universe AI narrative guidance and designed per-object FSMs to maintain gimmick consistency. Iteratively tuned difficulty curves using playtest completion-rate data. Released on Steam / STOVE.`,
      project1_tag1: 'Action Platformer',
      project1_tag2: 'FSM Object Architecture',
      project1_tag3: 'Difficulty Curve Design',
      alt_genesis: 'PROJECT : GENESIS pixel-art character',
      project2_summary: `<strong>[Problem]</strong> Rendering 23 hacking-puzzle types simultaneously with bullet swarms caused draw call spikes and frame drops.<br><br>
                         <strong>[Solution]</strong> Migrated bullet objects to an Object Pool and applied GPU Instancing — cutting draw calls by more than half. Post-launch, the game hit <strong>8th place in STOVE's monthly sales ranking (Dec 2024)</strong>.`,
      project2_tag1: 'Bullet Hell',
      project2_tag2: 'Casual Puzzle',
      project2_tag3: 'Level Design',
      alt_hacking: 'Hack.ing game icon',
      project3_name: 'Comparative Study on NPC AI Performance using FSM',
      project3_summary: `<strong>[Problem]</strong> Many developers assumed FSM-based NPC AI was inherently inefficient at scale — but no quantitative evidence existed to support or refute this.<br><br>
                         <strong>[Verification]</strong> Measured FPS across 10–500 NPC instances in Unity, proving that an optimized FSM architecture maintains significantly higher framerates than a naive implementation. Proposed a concrete improvement model backed by empirical data.<br><br>
                         <strong>Bronze Prize — 2025 DCS Summer Academic Conference</strong>`,
      read_paper: 'Read Paper',
      alt_paper: 'Bronze Prize certificate for the FSM NPC AI paper',
      project_award_name: 'MAYHEM',
      project_award_badge: 'Grand Prize',
      project_award_event: '2025 SCHU AI·SW Festival — Game Development Competition',
      project_award_summary: `<strong>[Problem]</strong> A simple kill-count score system failed to incentivize risky, skillful play — making the game feel shallow.<br><br>
                              <strong>[Solution]</strong> Designed a custom scoring formula <code>(Kills + Σ(Multi-kills − 1) × Style Score)</code> that rewards risk-taking, creating meaningful strategic tension. Combined with physics-based movement, the system earned the jury's praise and the <strong>Grand Prize</strong>.`,
      video_mayhem1: 'MAYHEM Demo (1)',
      video_mayhem2: 'MAYHEM Demo (2)',
      view_certificate_schu: 'View Certificate (PDF)',
      view_certificate: 'Certificate (PDF)',
      alt_schu: '2025 SCHU AI·SW Festival Grand Prize certificate (MAYHEM)',
      project_startup_name: 'Under-Shield',
      project_startup_badge: 'Silver Prize',
      project_startup_event: 'SCH 1st Local Startup Club Idea League · START-UP Track-1',
      project_startup_summary: `<strong>[Problem]</strong> EVs and low-CoG vehicles face a fatal underride risk in collisions. Full guardrail replacement costs make safety upgrades impractical for most municipalities.<br><br>
                               <strong>[Solution]</strong> Proposed the <strong>Anti-Underride Panel (A.U.P)</strong> — a bolt-on extension to existing guardrails that blocks underride without infrastructure replacement. A B2G / B2B-ready solution that achieves modern safety standards at a fraction of the cost.<br><br>
                               Awarded the <strong>Silver Prize</strong> at the 1st SCH Local Startup Club Idea League, START-UP Track-1.`,
      view_announcement: 'View Announcement',
      alt_silver: 'RAMIC STUDIO Silver Prize certificate',
      project_glamp_name: 'Soonchunhyang University G-LAMP 1st LAMP Supporters',
      project_glamp_summary: `<strong>[Role]</strong> Selected as an official PR Supporter for the SCH G-LAMP project group, tasked with translating specialist research into content accessible to a general audience.<br><br>
                            <strong>[Contribution]</strong> Planned and produced SNS-optimized formats (card news, short-form video) to increase public engagement with basic science content, bridging the gap between academia and the public.`,
      project_glamp_tag1: 'PR Supporters',
      project_glamp_tag2: 'Content Strategy & Production',
      project_glamp_tag3: 'Science Communication',
      project_glamp_tag4: 'SNS Marketing',
      alt_glamp: 'G-LAMP Supporters visual',
      work_empty: 'No projects use this technology yet.',
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
      form_sending: 'Sending…',
      form_success: 'Message sent successfully.',
      form_error: 'Something went wrong. Please try again in a moment or write to me by email.',
      form_invalid: 'Some fields need your attention.',
      err_required: 'This field is required.',
      err_email: 'Please enter a valid email address.',
      footer_time: 'Incheon',
      footer_top: 'Back to top',
      motion_off: 'Motion off',
      motion_on: 'Motion on',
      roles: ['Founder & CEO, RAMIC STUDIO', 'Game Developer', 'Gameplay Programmer', 'Creative Visionary', 'World Builder']
    }
  };

  let currentLang = 'ko';
  try { currentLang = localStorage.getItem('preferredLang') || 'ko'; } catch (e) { /* storage blocked */ }
  if (!translations[currentLang]) currentLang = 'ko';
  const t = key => (translations[currentLang] && translations[currentLang][key]) || translations.ko[key] || '';

  /* ── Lenis smooth scroll ────────────────────────────── */
  let lenis = null;
  if (hasLenis && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.2 });
    if (hasST) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  function scrollToTarget(target, offset) {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    const off = offset == null ? CONFIG.navOffset : offset;
    if (lenis) {
      lenis.scrollTo(el, { offset: off, duration: 1.6, easing: x => 1 - Math.pow(1 - x, 4) });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY + off;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }
  /** Move keyboard focus to a section/container without scrolling it (the scroll is animated separately). */
  function focusTarget(el) {
    if (!el) return;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  /* ── Menu overlay ───────────────────────────────────── */
  const hamburger = $('#hamburger');
  const overlay = $('#menu-overlay');
  let menuOpen = false;
  let lastFocus = null;

  function setInert(on) { $$('main, footer').forEach(el => { try { el.inert = on; } catch (e) { /* unsupported */ } }); }

  function openMenu() {
    if (menuOpen || !overlay) return;
    menuOpen = true;
    lastFocus = document.activeElement;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', t('nav_close'));
    body.classList.add('menu-open');
    setInert(true);
    if (lenis) lenis.stop();
    if (hasGSAP && !reduceMotion) {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      gsap.fromTo('.menu-links li', { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: 'power4.out', delay: 0.08 });
      gsap.fromTo('.menu-meta', { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.45 });
    }
    const first = overlay.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  }

  function closeMenu(restoreFocus) {
    if (!menuOpen || !overlay) return;
    menuOpen = false;
    overlay.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', t('nav_open'));
    body.classList.remove('menu-open');
    setInert(false);
    if (lenis) lenis.start();
    const done = () => { overlay.classList.remove('is-open'); if (hasGSAP) gsap.set(overlay, { clearProps: 'all' }); };
    if (hasGSAP && !reduceMotion) gsap.to(overlay, { opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: done });
    else done();
    if (restoreFocus !== false && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });
    window.matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches && menuOpen) closeMenu(); });
  }

  /* In-page anchors → Lenis (+ move focus to the target for keyboard users) */
  $$('a[href^="#"]:not(.skip-link)').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const el = document.getElementById(id.slice(1));
      if (!el) return;
      e.preventDefault();
      const wasOpen = menuOpen;
      closeMenu(false);
      const go = () => { scrollToTarget(el, id === '#hero' ? 0 : CONFIG.navOffset); focusTarget(el); };
      if (wasOpen) setTimeout(go, 60); else go();
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });
  const skipLink = $('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', e => {
      const main = $('#main');
      if (!main) return;
      e.preventDefault();
      focusTarget(main);
      if (lenis) lenis.scrollTo(main, { offset: 0, immediate: true }); else main.scrollIntoView();
    });
  }

  /* ── Text reveal registry (survives i18n re-render) ─── */
  const lineReveals = [];
  const REVEAL_START = 'top 88%';

  function createLineSplit(rec) {
    rec.split = SplitText.create(rec.el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'rl',
      autoSplit: true,
      onSplit(self) {
        if (rec.tween) { if (rec.tween.scrollTrigger) rec.tween.scrollTrigger.kill(); rec.tween.kill(); rec.tween = null; }
        if (rec.revealed) return gsap.set(self.lines, { yPercent: 0 });
        rec.tween = gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.15,
          ease: 'power4.out',
          stagger: 0.085,
          scrollTrigger: { trigger: rec.el, start: REVEAL_START, once: true, onEnter: () => { rec.revealed = true; } }
        });
        return rec.tween;
      }
    });
  }

  function mountReveal(el) {
    const type = el.dataset.reveal || 'fade';
    el.classList.add('is-mounted');
    if (!hasST || reduceMotion) return;
    const st = { trigger: el, start: REVEAL_START, once: true };

    if (type === 'lines' && hasSplit) {
      const rec = { el, split: null, tween: null, revealed: false };
      lineReveals.push(rec);
      createLineSplit(rec);
      return;
    }
    if (type === 'clip') {
      const media = el.querySelector('img, .visual-type');
      gsap.set(el, { clipPath: 'inset(0 0 100% 0)' });
      const tl = gsap.timeline({ scrollTrigger: st });
      tl.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.inOut' }, 0);
      if (media) tl.from(media, { scale: '+=0.18', duration: 1.7, ease: 'power3.out' }, 0);
      return;
    }
    gsap.from(el, { y: 34, opacity: 0, duration: 1.0, ease: 'power3.out', scrollTrigger: st });
  }

  function revertLineSplits() {
    lineReveals.forEach(rec => {
      if (rec.tween) { if (rec.tween.scrollTrigger) rec.tween.scrollTrigger.kill(); rec.tween.kill(); rec.tween = null; }
      if (rec.split) { rec.split.revert(); rec.split = null; }
    });
  }
  /** After a language swap only elements that have not been revealed yet need a fresh split (revealed ones simply show as plain text). */
  function remountLineSplits() {
    if (!hasSplit || !hasST || reduceMotion) return;
    lineReveals.forEach(rec => { if (!rec.revealed) createLineSplit(rec); });
    ScrollTrigger.refresh();
  }

  /* ── Roles rotation (anime.js) ──────────────────────── */
  const roleEl = $('#role-text');
  let roles = translations[currentLang].roles;
  let roleIdx = 0, roleTimer = null, rolesStarted = false, rolesPaused = false, roleAnim = null;

  function cancelRoleAnim() {
    if (roleAnim && typeof roleAnim.cancel === 'function') roleAnim.cancel();
    roleAnim = null;
  }
  function renderRole(text) {
    roleEl.textContent = '';
    roleEl.setAttribute('aria-label', text);
    const frag = document.createDocumentFragment();
    Array.from(text).forEach(ch => {
      const s = document.createElement('span');
      s.className = 'role-char';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = ch === ' ' ? ' ' : ch;
      frag.appendChild(s);
    });
    roleEl.appendChild(frag);
    return $$('.role-char', roleEl);
  }
  function showRole() {
    if (!roleEl || !roles.length) return;
    clearTimeout(roleTimer);
    cancelRoleAnim();
    const chars = renderRole(roles[roleIdx]);
    if (reduceMotion) return; // static under reduced motion
    if (hasAnime) {
      roleAnim = anime.animate(chars, { y: ['0.9em', '0em'], opacity: [0, 1], delay: anime.stagger(22), duration: 720, ease: 'outExpo' });
      roleTimer = setTimeout(hideRole, 2700);
    } else {
      roleTimer = setTimeout(nextRole, 2700);
    }
  }
  function hideRole() {
    if (rolesPaused) return;
    cancelRoleAnim();
    const chars = $$('.role-char', roleEl);
    roleAnim = anime.animate(chars, { y: ['0em', '-0.9em'], opacity: [1, 0], delay: anime.stagger(12), duration: 420, ease: 'inExpo', onComplete: nextRole });
  }
  function nextRole() { if (rolesPaused) return; roleIdx = (roleIdx + 1) % roles.length; showRole(); }
  function startRoles() { if (rolesStarted) return; rolesStarted = true; showRole(); }
  function resetRoles() { clearTimeout(roleTimer); cancelRoleAnim(); roleIdx = 0; if (rolesStarted) showRole(); }
  function pauseRoles() { rolesPaused = true; clearTimeout(roleTimer); }
  function resumeRoles() { if (!rolesPaused) return; rolesPaused = false; if (rolesStarted) showRole(); }

  /* ── Hangul-aware labels (mono tracking is tuned for Latin) ── */
  const HANGUL = /[가-힣]/;
  const ownTextHasHangul = el => Array.from(el.childNodes).some(n => n.nodeType === 3 && HANGUL.test(n.textContent));
  function markHangul() {
    // Only the element's own text nodes count, so a container holding one Korean link does not de-style its siblings.
    $$('.mono, .mono [data-i18n], .submit-btn-text, .activity-status, .arrow-link span, .exp-tags li, .work-stack li, .activity-tags li, .proj-badge, .exp-badge, .footer-links a, .footer-links button, .tech-chip, .menu-meta a, .stat-label')
      .forEach(el => el.classList.toggle('is-hangul', ownTextHasHangul(el)));
  }

  /* ── Motion toggle (site-level override of animation) ── */
  const motionBtn = $('#motion-toggle');
  function updateMotionLabel() {
    if (!motionBtn) return;
    motionBtn.textContent = motionOff ? t('motion_on') : t('motion_off');
    motionBtn.setAttribute('aria-pressed', motionOff ? 'true' : 'false');
  }
  if (motionBtn && !osReducedMotion) {
    motionBtn.hidden = false;
    motionBtn.addEventListener('click', () => {
      try { if (motionOff) localStorage.removeItem('motionOff'); else localStorage.setItem('motionOff', '1'); } catch (e) { /* ignore */ }
      location.reload();
    });
  }

  /* ── Language switch ────────────────────────────────── */
  function updateLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    try { localStorage.setItem('preferredLang', lang); } catch (e) { /* ignore */ }
    html.lang = lang;
    $$('.lang-btn').forEach(btn => {
      const on = btn.dataset.lang === lang;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    revertLineSplits();
    $$('[data-i18n]').forEach(el => {
      const v = translations[lang][el.dataset.i18n];
      if (v != null) el.innerHTML = v;
    });
    $$('[data-i18n-aria]').forEach(el => {
      const v = translations[lang][el.dataset.i18nAria];
      if (v != null) el.setAttribute('aria-label', v);
    });
    $$('[data-i18n-alt]').forEach(el => {
      const v = translations[lang][el.dataset.i18nAlt];
      if (v != null) el.setAttribute('alt', v);
    });
    if (hamburger) hamburger.setAttribute('aria-label', menuOpen ? t('nav_close') : t('nav_open'));
    roles = translations[lang].roles;
    resetRoles();
    updateMotionLabel();
    markHangul(); // after every text swap so Hangul detection sees the new strings
    remountLineSplits();
  }
  $$('.lang-btn').forEach(btn => btn.addEventListener('click', () => { if (btn.dataset.lang !== currentLang) updateLanguage(btn.dataset.lang); }));
  updateLanguage(currentLang); // before reveals mount → no splits to revert yet

  /* ── Mount reveals ──────────────────────────────────── */
  $$('[data-reveal]').forEach(mountReveal);
  $$('[data-reveal-group]').forEach(group => {
    group.classList.add('is-mounted');
    if (!hasST || reduceMotion) return;
    gsap.from(group.children, { y: 26, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: group, start: REVEAL_START, once: true } });
  });

  /* ── Hero background: Spline slot or WebGL silk ─────── */
  let silk = null, silkStarted = false;
  (function initHeroBackground() {
    const canvas = $('#silk');
    const slot = $('#hero-spline');
    if (CONFIG.splineScene && slot) {
      const s = document.createElement('script');
      s.type = 'module';
      s.src = CONFIG.splineViewer;
      document.head.appendChild(s);
      const viewer = document.createElement('spline-viewer');
      viewer.setAttribute('url', CONFIG.splineScene);
      viewer.setAttribute('loading-anim-type', 'none');
      slot.appendChild(viewer);
      slot.hidden = false;
      if (canvas) canvas.hidden = true;
      return;
    }
    if (!canvas || typeof window.createSilk !== 'function') return;
    silk = createSilk(canvas, { colors: CONFIG.silkColors });
    if (!silk) { canvas.hidden = true; return; }
  })();
  function startSilk() { if (silk && !silkStarted) { silkStarted = true; silk.start(); } }

  // Pause the silk and the role ticker while the hero is offscreen
  if (hasST) {
    ScrollTrigger.create({
      trigger: '#hero', start: 'top bottom', end: 'bottom top',
      onToggle: self => { if (silk) silk.setInView(self.isActive); if (self.isActive) resumeRoles(); else pauseRoles(); }
    });
  } else if ('IntersectionObserver' in window) {
    const heroEl = $('#hero');
    if (heroEl) new IntersectionObserver(entries => entries.forEach(en => { if (silk) silk.setInView(en.isIntersecting); if (en.isIntersecting) resumeRoles(); else pauseRoles(); })).observe(heroEl);
  }

  /* ── Hero scroll-out ────────────────────────────────── */
  if (hasST && !reduceMotion) {
    gsap.to('.hero-content', { yPercent: -16, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: '80% top', scrub: true } });
    gsap.to('.hero-foot', { opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: '40% top', scrub: true } });
    gsap.to('.hero-bg', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* ── Hero intro ─────────────────────────────────────── */
  let heroIntroDone = false;
  function introHero() {
    if (heroIntroDone) return;
    heroIntroDone = true;
    if (!hasGSAP || reduceMotion) { startRoles(); return; }
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    if (hasSplit) {
      const split = SplitText.create('.hero-word', { type: 'chars', charsClass: 'hero-char' });
      tl.from(split.chars, { yPercent: 118, rotate: 3, duration: 1.35, stagger: { each: 0.035, from: 'start' } }, 0.05);
    } else {
      tl.from('#hero-title', { y: 40, opacity: 0, duration: 1.1 }, 0.05);
    }
    tl.from('.hero-eyebrow', { y: 14, opacity: 0, duration: 0.9 }, 0.45)
      .from('#hero-subtitle', { y: 26, opacity: 0, duration: 1.1 }, 0.75)
      .from('#hero-roles', { opacity: 0, duration: 0.8 }, 1.0)
      .from('.hero-foot', { opacity: 0, y: 10, duration: 0.9 }, 1.15)
      .from('#navbar', { y: -14, opacity: 0, duration: 0.9 }, 0.9)
      .add(startRoles, 1.0);
  }

  /* ── Preloader ──────────────────────────────────────── */
  const preloader = $('#preloader');
  let seen = false;
  try { seen = sessionStorage.getItem('hl-seen') === '1'; } catch (e) { /* ignore */ }

  function finishLoading(runIntro) {
    body.classList.remove('is-loading');
    if (preloader) preloader.classList.add('is-done');
    try { sessionStorage.setItem('hl-seen', '1'); } catch (e) { /* ignore */ }
    if (lenis) lenis.start();
    if (hasST) ScrollTrigger.refresh();
    startSilk();
    if (runIntro) introHero();
  }

  if (!preloader || reduceMotion || !hasGSAP || seen) {
    finishLoading(true);
  } else {
    if (lenis) lenis.stop();
    const num = $('#preloader-num');
    const fill = $('#preloader-bar-fill');
    const name = $('#preloader-name');
    const counter = { v: 0 };
    gsap.timeline({ onComplete: () => finishLoading(false) })
      .from(name, { yPercent: 40, opacity: 0, duration: 1.0, ease: 'power3.out' }, 0)
      .from('.preloader-meta', { opacity: 0, duration: 0.6 }, 0.3)
      .to(counter, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => { if (num) num.textContent = String(Math.round(counter.v)).padStart(2, '0'); } }, 0.2)
      .to(fill, { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0.2)
      .add(startSilk, 0.8) // compile + first frame happen behind the opaque curtain
      .to([name, '.preloader-meta', '.preloader-bar'], { yPercent: -30, opacity: 0, duration: 0.5, ease: 'power2.in', stagger: 0.04 }, '+=0.1')
      .to(preloader, { yPercent: -100, duration: 1.05, ease: 'power4.inOut', onStart: introHero }, '-=0.4');
  }

  /* ── Navigation state ───────────────────────────────── */
  const navbar = $('#navbar');
  const progressFill = $('#scroll-progress-fill');
  const navAnchors = $$('.nav-links a');
  function onScrollPos(y, progress) {
    if (navbar) navbar.classList.toggle('scrolled', y > 40);
    if (progressFill) progressFill.style.transform = 'scaleX(' + Math.max(0, Math.min(1, progress || 0)) + ')';
  }
  if (lenis) {
    lenis.on('scroll', e => onScrollPos(e.scroll, e.progress));
  } else {
    const handler = () => { const max = document.documentElement.scrollHeight - window.innerHeight; onScrollPos(window.scrollY, max > 0 ? window.scrollY / max : 0); };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
  }
  function setActiveNav(id) {
    navAnchors.forEach(a => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  const sections = $$('main section[id]');
  if (hasST) {
    sections.forEach(sec => ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onToggle: self => { if (self.isActive) setActiveNav(sec.id); } }));
  } else {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - window.innerHeight / 2.2) current = sec.id; });
      setActiveNav(current);
    }, { passive: true });
  }

  /* ── Marquee ────────────────────────────────────────── */
  (function initMarquee() {
    const track = $('#marquee-track');
    if (!track) return;
    if (!track.querySelector('.marquee-group')) {
      const content = track.innerHTML;
      track.innerHTML = '<div class="marquee-group">' + content + '</div><div class="marquee-group" aria-hidden="true">' + content + '</div>';
    }
    if (!hasGSAP || reduceMotion) return;
    const tween = gsap.to(track, { xPercent: -50, duration: 42, ease: 'none', repeat: -1 });
    if (hasST) ScrollTrigger.create({ trigger: '.marquee', start: 'top bottom', end: 'bottom top', onToggle: self => (self.isActive ? tween.play() : tween.pause()) });
  })();

  /* ── Counters (anime.js) ────────────────────────────── */
  $$('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const raw = el.hasAttribute('data-count-raw');
    const fmt = v => (raw ? String(Math.round(v)) : Math.round(v).toLocaleString('en-US'));
    if (!hasST || reduceMotion) { el.textContent = fmt(target); return; }
    el.textContent = fmt(0);
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter() {
        const o = { v: 0 };
        if (hasAnime) anime.animate(o, { v: target, duration: 1900, ease: 'outExpo', onUpdate: () => { el.textContent = fmt(o.v); } });
        else gsap.to(o, { v: target, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.v); } });
      }
    });
  });

  /* ── Skill bars (anime.js spring) ───────────────────── */
  (function initSkillBars() {
    const fills = $$('.skill-bar-fill');
    if (!fills.length) return;
    const pct = el => (parseFloat(el.dataset.percent) || 0) / 100;
    fills.forEach(f => f.style.setProperty('--pct', pct(f)));
    const run = () => {
      if (hasAnime && !reduceMotion) {
        anime.animate(fills, {
          scaleX: el => [0, pct(el)], // explicit from-value: anime reads inline styles only
          delay: anime.stagger(70),
          ease: typeof anime.spring === 'function' ? anime.spring({ stiffness: 55, damping: 13, mass: 1 }) : 'outExpo',
          duration: 1400
        });
      } else {
        fills.forEach(f => { f.style.transform = 'scaleX(' + pct(f) + ')'; });
      }
    };
    if (!hasST || reduceMotion) { run(); return; }
    ScrollTrigger.create({ trigger: '#skills-grid', start: 'top 82%', once: true, onEnter: run });
  })();

  /* ── Tech filter ────────────────────────────────────── */
  (function initFilter() {
    const chips = $$('.tech-chip');
    const items = $$('#projects-list .work-item');
    const empty = $('#work-empty');
    const status = $('#filter-status');
    if (!chips.length || !items.length) return;
    chips.forEach(chip => chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      chips.forEach(c => { const on = c === chip; c.classList.toggle('active', on); c.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      let visible = 0;
      items.forEach(item => {
        const tech = (item.dataset.tech || '').split(/\s+/);
        const show = filter === 'all' || tech.includes(filter);
        item.classList.toggle('filtered-out', !show);
        if (show) visible++;
      });
      if (empty) empty.hidden = visible > 0;
      if (status) status.textContent = t('filter_shown').replace('{n}', visible);
      if (hasST) ScrollTrigger.refresh();
      if (hasGSAP && !reduceMotion) gsap.fromTo(items.filter(i => !i.classList.contains('filtered-out')), { opacity: 0.4 }, { opacity: 1, duration: 0.6, stagger: 0.04, overwrite: 'auto' });
      if (filter !== 'all') scrollToTarget('#projects');
    }));
  })();

  /* ── Pointer effects (fine pointers only) ───────────── */
  if (finePointer && hasGSAP && !reduceMotion) {
    // Magnetic
    $$('[data-magnetic]').forEach(el => {
      const strength = parseFloat(el.dataset.magnetic) || 0.3;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      });
      el.addEventListener('pointerleave', () => { gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' }); });
    });

    // Tilt
    $$('[data-tilt]').forEach(el => {
      const max = 7;
      gsap.set(el, { transformPerspective: 1100 });
      const rxTo = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3.out' });
      const ryTo = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3.out' });
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rxTo(-py * max * 2);
        ryTo(px * max * 2);
      });
      el.addEventListener('pointerleave', () => { gsap.to(el, { rotationX: 0, rotationY: 0, duration: 1.1, ease: 'elastic.out(1, 0.5)' }); });
    });

    // Custom cursor — only takes over once a real mouse moves (stylus/touch keep the native pointer)
    const cursor = $('#cursor');
    if (cursor) {
      const dot = $('.cursor-dot', cursor), ring = $('.cursor-ring', cursor), label = $('#cursor-label');
      gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
      const dx = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' }), dy = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
      const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
      let shown = false;
      window.addEventListener('pointermove', e => {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        if (!shown) { shown = true; html.classList.add('has-cursor'); gsap.set([dot, ring], { x: e.clientX, y: e.clientY }); cursor.classList.add('is-visible'); }
        dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      }, { passive: true });
      document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
      document.addEventListener('mouseenter', () => { if (shown) cursor.classList.add('is-visible'); });
      document.addEventListener('pointerover', e => {
        const target = e.target.closest('a, button, [data-cursor], input, textarea, label');
        if (!target) { cursor.classList.remove('is-hover', 'is-label'); label.textContent = ''; return; }
        const text = target.dataset.cursor;
        if (text) { label.textContent = text; cursor.classList.add('is-label'); cursor.classList.remove('is-hover'); }
        else { cursor.classList.add('is-hover'); cursor.classList.remove('is-label'); label.textContent = ''; }
      });
      document.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
      document.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
    }
  }

  // Spotlight cards (works for any pointer; harmless on touch)
  $$('[data-spotlight]').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ── Scroll-linked parallax & timelines ─────────────── */
  if (hasST && !reduceMotion) {
    $$('[data-parallax]').forEach(frame => {
      const img = frame.querySelector('img');
      if (!img) return;
      const amt = parseFloat(frame.dataset.parallax) || 9;
      gsap.fromTo(img, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.timeline').forEach(tl => {
      const line = tl.querySelector('.timeline-line');
      if (!line) return;
      gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: tl, start: 'top 78%', end: 'bottom 55%', scrub: 0.6 } });
    });
  }

  /* ── Footer clock (Asia/Seoul) ──────────────────────── */
  (function initClock() {
    const el = $('#local-time');
    if (!el) return;
    let fmt = null;
    try { fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Seoul' }); } catch (e) { return; }
    const tick = () => { el.textContent = fmt.format(new Date()) + ' KST'; };
    tick();
    setInterval(tick, 30000);
  })();

  /* ── Contact form ───────────────────────────────────── */
  (function initForm() {
    const form = $('#contact-form');
    const note = $('#form-note');
    if (!form) return;
    const fields = ['name', 'email', 'message'].map(id => $('#' + id, form)).filter(Boolean);
    let noteTimer = null;
    const setNote = (msg, kind) => {
      if (!note) return;
      clearTimeout(noteTimer);
      note.textContent = msg;
      note.className = 'form-note mono' + (kind ? ' is-' + kind : '');
      if (kind === 'success') noteTimer = setTimeout(() => { note.textContent = ''; note.className = 'form-note mono'; }, 8000);
    };
    const msgFor = el => (el.validity.valueMissing ? t('err_required') : el.validity.typeMismatch ? t('err_email') : '');
    const paintField = el => {
      const m = msgFor(el);
      const err = $('#' + el.id + '-error', form);
      if (err) err.textContent = m;
      el.setAttribute('aria-invalid', m ? 'true' : 'false');
      return m;
    };
    fields.forEach(el => el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') paintField(el); }));

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.checkValidity()) {
        let first = null;
        fields.forEach(el => { if (paintField(el) && !first) first = el; });
        setNote(t('form_invalid'), 'error');
        if (first) first.focus();
        return;
      }
      fields.forEach(el => { el.removeAttribute('aria-invalid'); const err = $('#' + el.id + '-error', form); if (err) err.textContent = ''; });
      const btn = form.querySelector('button[type=submit]');
      const label = btn ? btn.querySelector('.submit-btn-text') : null;
      const original = label ? label.textContent : '';
      if (btn) { btn.classList.add('is-busy'); btn.setAttribute('aria-busy', 'true'); }
      if (label) label.textContent = t('form_sending');
      setNote('', '');
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        setNote(t('form_success'), 'success');
        form.reset();
      } catch (err) {
        setNote(t('form_error'), 'error');
      } finally {
        if (btn) { btn.classList.remove('is-busy'); btn.removeAttribute('aria-busy'); }
        if (label) label.textContent = original;
      }
    });
  })();

  /* ── Refresh on load / fonts ────────────────────────── */
  if (hasST) {
    window.addEventListener('load', () => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();
