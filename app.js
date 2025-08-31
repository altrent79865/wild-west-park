/* =========================================
   Wild West Family Park — JS (896px breakpoint)
   Fixed header; button stays in header
   ========================================= */
(function () {
  // Prevent initial scroll to anchor on page load
  if (window.location.hash) {
    // Remove the hash without scrolling
    history.replaceState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );
  }

  // Footer year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  const header = document.querySelector(".site-header");
  const headerInner = document.querySelector(".site-header .header-inner");
  const drawer = document.getElementById("primary-nav"); // .nav.nav-drawer
  const backdrop = document.querySelector(".drawer-backdrop");
  const btn = document.querySelector(".menu-toggle");

  if (!header || !headerInner || !drawer || !backdrop || !btn) return;

  const MOBILE_MAX = 896;

  // Move drawer/backdrop between header and body as needed
  function moveForViewport() {
    if (window.innerWidth <= MOBILE_MAX) {
      if (drawer.parentNode !== document.body)
        document.body.appendChild(drawer);
      if (backdrop.parentNode !== document.body)
        document.body.appendChild(backdrop);
    } else {
      if (drawer.parentNode !== headerInner) headerInner.appendChild(drawer);
      if (backdrop.parentNode !== header) header.appendChild(backdrop);
    }
  }

  // Preserve open/closed state on resize without forcing close
  function placeForViewport() {
    const wasOpen = document.body.classList.contains("drawer-open");
    moveForViewport();

    if (wasOpen) {
      btn.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Close navigation");
      backdrop.removeAttribute("hidden");
    } else {
      btn.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Open navigation");
      backdrop.setAttribute("hidden", "");
    }
  }

  // Initial placement + resize (debounced with rAF)
  placeForViewport();
  let rAF = null;
  window.addEventListener("resize", () => {
    if (rAF) cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(placeForViewport);
  });

  const focusables = () =>
    drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');

  function openDrawer() {
    if (window.innerWidth <= MOBILE_MAX) moveForViewport();
    document.body.classList.add("drawer-open");
    btn.classList.add("is-open"); // hamburger → X
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "Close navigation");
    backdrop.removeAttribute("hidden");

    const first = focusables()[0];
    if (first) first.focus({ preventScroll: true });
  }

  function closeDrawer({ restoreFocus = true } = {}) {
    document.body.classList.remove("drawer-open");
    btn.classList.remove("is-open"); // X → hamburger
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Open navigation");
    backdrop.setAttribute("hidden", "");
    if (restoreFocus && window.innerWidth <= MOBILE_MAX) {
      btn.focus({ preventScroll: true });
    }
  }

  btn.addEventListener("click", () => {
    document.body.classList.contains("drawer-open")
      ? closeDrawer()
      : openDrawer();
  });

  backdrop.addEventListener("click", () => closeDrawer());

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("drawer-open"))
      closeDrawer();
  });

  drawer.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link && document.body.classList.contains("drawer-open")) {
      closeDrawer({ restoreFocus: false });
    }
  });
})();
