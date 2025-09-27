(function(){
  if (window.__editModeCMSInited) return;
  window.__editModeCMSInited = true;
  window.CMS_MANUAL_INIT = true;

  function hasDevBypass(){
    try{
      const p = new URLSearchParams(location.search);
      if (p.get('dev') === '1') return true;
      return localStorage.getItem('decap_dev_bypass') === '1';
    }catch(e){ return false; }
  }

  function buildDevConfig(){
    return {
      backend: { name: 'test-repo' },
      local_backend: false,
      publish_mode: 'editorial_workflow',
      media_folder: 'public/images/uploads',
      public_folder: '/images/uploads',
      collections: [
        {
          name: 'news',
          label: 'ニュース',
          label_singular: '記事',
          folder: 'content/news',
          create: true,
          identifier_field: 'slug',
          slug: "{{year}}-{{month}}-{{day}}-{{slug}}",
          preview_path: "news/{{slug}}",
          sort: 'date:desc',
          fields: [
            { label: '公開ステータス', name: 'status', widget: 'select', default: 'draft', options: [
              { label: '下書き', value: 'draft' },
              { label: 'レビュー中', value: 'reviewing' },
              { label: '公開済み', value: 'published' }
            ]},
            { label: '公開フラグ', name: 'published', widget: 'boolean', default: false },
            { label: '公開言語', name: 'publish', widget: 'object', collapsed: false, fields: [
              { label: '日本語', name: 'ja', widget: 'boolean', default: true },
              { label: '英語', name: 'en', widget: 'boolean', default: false }
            ]},
            { label: '公開日', name: 'date', widget: 'datetime', format: 'YYYY-MM-DD', time_format: false },
            { label: 'スラッグ', name: 'slug', widget: 'string', pattern: ['^[a-z0-9-]+$', '英数字とハイフンのみが使用できます'] },
            { label: 'ピン留め (トップ表示)', name: 'pinned', widget: 'boolean', default: false },
            { label: 'タグ', name: 'tags', widget: 'list', required: false, summary: '{{fields.tag}}', field: { label: 'タグ', name: 'tag', widget: 'string' } },
            { label: 'タイトル', name: 'title', widget: 'object', collapsed: false, fields: [
              { label: '日本語', name: 'ja', widget: 'string', required: true },
              { label: '英語', name: 'en', widget: 'string', required: false }
            ]},
            { label: 'サマリー', name: 'summary', widget: 'object', collapsed: false, fields: [
              { label: '日本語', name: 'ja', widget: 'text', required: true },
              { label: '英語', name: 'en', widget: 'text', required: false }
            ]},
            { label: '本文', name: 'body', widget: 'object', collapsed: false, fields: [
              { label: '日本語', name: 'ja', widget: 'markdown' },
              { label: '英語', name: 'en', widget: 'markdown' }
            ]},
            { label: 'サムネイル画像', name: 'image', widget: 'image', allow_multiple: false },
            { label: '代替テキスト', name: 'alt', widget: 'object', collapsed: false, fields: [
              { label: '日本語', name: 'ja', widget: 'string', required: true },
              { label: '英語', name: 'en', widget: 'string' }
            ]}
          ]
        }
      ]
    };
  }

  function init(){
    if (!window.CMS) { document.addEventListener('CMSLoaded', init, { once: true }); return; }

    if (hasDevBypass()) {
      CMS.init({ config: buildDevConfig() });
      return;
    }

    // Normal path uses YAML
    CMS.init({ config: '/admin/config.yml' });

    // Hook login button to enable dev bypass
    try{
      const observer = new MutationObserver(() => {
        const btn = Array.from(document.querySelectorAll('button, a')).find(el => /login with github/i.test(el.textContent || ''));
        if (btn) {
          btn.addEventListener('click', (ev) => {
            ev.preventDefault();
            localStorage.setItem('decap_dev_bypass', '1');
            const url = new URL(location.href);
            url.searchParams.set('dev','1');
            location.href = url.toString();
          }, { once: true });
          observer.disconnect();
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }catch(e){}
  }

  init();
})();
