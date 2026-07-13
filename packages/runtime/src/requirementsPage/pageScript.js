export const REQUIREMENTS_PAGE_SCRIPT = `(function () {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menuBtn');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('#navList a');
  const sections = document.querySelectorAll('section[id]');
  const progressBar = document.getElementById('progressBar');
  const backTop = document.getElementById('backTop');

  function openNav() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    navOverlay && navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    navOverlay && navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuBtn && menuBtn.addEventListener('click', openNav);
  navOverlay && navOverlay.addEventListener('click', closeNav);
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + '%';
    if (backTop) backTop.classList.toggle('visible', scrollTop > 400);

    let current = '';
    sections.forEach(function (sec) {
      if (scrollTop >= sec.offsetTop - 120) current = sec.getAttribute('id') || '';
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backTop && backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();`;
export const REQUIREMENTS_PAGE_HEAD_LINKS = '';
