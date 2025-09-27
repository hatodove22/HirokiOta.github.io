(function(){
  // Force manual init with single source of truth (config.yml)
  if (window.__editModeCMSInited) return;
  window.__editModeCMSInited = true;
  window.CMS_MANUAL_INIT = true;
  function init(){
    if (!window.CMS) { document.addEventListener('CMSLoaded', init, { once: true }); return; }
    CMS.init({ config: '/admin/config.yml' });
  }
  init();
})();
