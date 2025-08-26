/* =========================================
   Wild West Family Park — JS
   - Mobile: nav/backdrop in BODY (viewport-fixed)
   - Desktop: nav/backdrop in HEADER (tabs visible)
   - Toggle right-side drawer with backdrop
   - Animated hamburger ↔ X (.is-open + body.drawer-open)
   - Esc/backdrop/link close, footer year
   ========================================= */

   (function () {
    // Footer year
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  
    const header = document.querySelector('.site-header');
    const headerInner = document.querySelector('.site-header .header-inner');
    let drawer = document.getElementById('primary-nav');   // .nav.nav-drawer
    let backdrop = document.querySelector('.drawer-backdrop');
    const btn = document.querySelector('.menu-toggle');
  
    if (!header || !headerInner || !drawer || !backdrop || !btn) return;
  
    const MOBILE_MAX = 830;
  
    function moveToBody() {
      if (drawer.parentNode !== document.body) document.body.appendChild(drawer);
      if (backdrop.parentNode !== document.body) document.body.appendChild(backdrop);
    }
    function moveToHeader() {
      if (drawer.parentNode !== headerInner) headerInner.appendChild(drawer);
      if (backdrop.parentNode !== header) header.appendChild(backdrop);
    }
  
    function placeForViewport() {
      if (window.innerWidth <= MOBILE_MAX) {
        moveToBody();
      } else {
        closeDrawer();  // ensure hamburger state on desktop
        moveToHeader();
      }
    }
  
    // Initial placement and on resize
    placeForViewport();
    window.addEventListener('resize', placeForViewport);
  
    const focusables = () =>
      drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
  
    function openDrawer() {
      if (window.innerWidth <= MOBILE_MAX) moveToBody(); // safety
      document.body.classList.add('drawer-open');
      btn.classList.add('is-open');                      // triggers X
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Close navigation');
      backdrop.removeAttribute('hidden');
      const first = focusables()[0];
      if (first) first.focus({ preventScroll: true });
    }
  
    function closeDrawer() {
      document.body.classList.remove('drawer-open');
      btn.classList.remove('is-open');                   // back to hamburger
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open navigation');
      backdrop.setAttribute('hidden', '');
      if (window.innerWidth <= MOBILE_MAX) btn.focus({ preventScroll: true });
    }
  
    btn.addEventListener('click', () => {
      document.body.classList.contains('drawer-open') ? closeDrawer() : openDrawer();
    });
  
    backdrop.addEventListener('click', closeDrawer);
  
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) closeDrawer();
    });
  
    drawer.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && document.body.classList.contains('drawer-open')) closeDrawer();
    });
  })();