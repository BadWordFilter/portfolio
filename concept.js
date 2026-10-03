(() => {
  'use strict';
  const root = document.documentElement;
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('.motion-button');
  let motionDisabled = false;
  const setMotion = () => {
    root.classList.toggle('reduce-motion', motionDisabled || motionQuery.matches);
    motionButton.setAttribute('aria-pressed', String(motionDisabled));
    motionButton.textContent = motionDisabled ? '모션 켜기' : '모션 끄기';
  };
  motionButton.addEventListener('click', () => { motionDisabled = !motionDisabled; setMotion(); });
  motionQuery.addEventListener('change', setMotion);
  setMotion();
  if ('IntersectionObserver' in window) {
    root.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }
  const filters = document.querySelectorAll('.filter');
  const projects = document.querySelectorAll('.project');
  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    projects.forEach(project => {
      project.hidden = filter !== 'all' && !project.dataset.tech.split(' ').includes(filter);
      if (!project.hidden) count++;
    });
    document.querySelector('.filter-count').textContent = `${count} projects`;
  }));
  const dialog = document.querySelector('.project-dialog');
  const dialogContent = document.querySelector('.dialog-content');
  let opener;
  document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => {
    const template = document.getElementById(button.dataset.case);
    dialogContent.replaceChildren(template.content.cloneNode(true));
    opener = button;
    dialog.showModal();
    dialog.scrollTop = 0;
    root.classList.add('dialog-open');
  }));
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { root.classList.remove('dialog-open'); opener?.focus(); });
})();
