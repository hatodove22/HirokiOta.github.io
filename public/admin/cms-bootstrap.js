(function(){
  if (window.__editModeCMSInited) return;
  window.__editModeCMSInited = true;
  window.CMS_MANUAL_INIT = true;

  // Where to send users after clicking "Login with GitHub"
  var PROTO_URL = (function(){
    try { return localStorage.getItem('proto_url') || 'http://localhost:5174'; } catch(e) { return 'http://localhost:5174'; }
  })();

  // Wait until window.CMS is available, then init with YAML config only
  let tries = 0;
  const timer = setInterval(() => {
    tries++;
    if (window.CMS) {
      clearInterval(timer);
      CMS.init({ config: '/admin/config.yml' });

      // Attach redirect on the login page
      try {
        const attach = () => {
          // only on the login/landing hash
          const onLoginHash = !location.hash || location.hash === '#/' || location.hash === '#/login';
          if (!onLoginHash) return;
          const btn = Array.from(document.querySelectorAll('button, a')).find(el => /login with github/i.test(el.textContent || ''));
          if (btn && !btn.__proto_redirect_patched) {
            btn.__proto_redirect_patched = true;
            btn.addEventListener('click', (ev) => {
              try { ev.preventDefault(); } catch(e){}
              try { location.href = PROTO_URL; } catch(e){}
            }, { once: true });
          }
        };

        const mo = new MutationObserver(() => attach());
        mo.observe(document.documentElement, { childList: true, subtree: true });
        // also run once immediately
        setTimeout(attach, 50);
        setTimeout(attach, 500);
      } catch(e) {}
    } else if (tries > 60) {
      clearInterval(timer);
      console.error('[admin] CMS failed to load');
    }
  }, 100);
})();
