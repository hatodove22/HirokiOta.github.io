(function () {
  'use strict';

  var register = function register() {
    var CMS = window.CMS;
    var React = window.React;

    if (!CMS || !React) { document.addEventListener('CMSLoaded', register, { once: true }); return; }

    var h = React.createElement;
    var useMemo = React.useMemo;
    var useState = React.useState;
    var useEffect = React.useEffect;

    var classNames = function classNames() {
      return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
    };

    var formatDate = function formatDate(value) {
      if (!value) {
        return '未設定';
      }
      try {
        var dt = new Date(value);
        if (!isNaN(dt.getTime())) {
          return dt.getFullYear() + '年' + String(dt.getMonth() + 1).padStart(2, '0') + '月' + String(dt.getDate()).padStart(2, '0') + '日';
        }
      } catch (error) {
        console.warn('[EditMode] failed to format date', error);
      }
      return value;
    };

    var ensureString = function ensureString(value) {
      return typeof value === 'string' ? value : '';
    };

    var ensureBoolean = function ensureBoolean(value, fallback) {
      return typeof value === 'boolean' ? value : fallback;
    };

    var ensureStringArray = function ensureStringArray(value) {
      if (!Array.isArray(value)) {
        return [];
      }
      return value.filter(function (item) {
        return typeof item === 'string' && item.trim().length > 0;
      });
    };

    var normaliseNews = function normaliseNews(input) {
      var data = input || {};
      var publish = data.publish && typeof data.publish === 'object' ? data.publish : {};
      var title = data.title && typeof data.title === 'object' ? data.title : {};
      var summary = data.summary && typeof data.summary === 'object' ? data.summary : {};
      var body = data.body && typeof data.body === 'object' ? data.body : {};
      var alt = data.alt && typeof data.alt === 'object' ? data.alt : {};

      return {
        status: ensureString(data.status || 'draft').toLowerCase(),
        slug: ensureString(data.slug || data.id),
        date: ensureString(data.date),
        pinned: ensureBoolean(data.pinned, false),
        published: ensureBoolean(data.published, false),
        publish: {
          ja: ensureBoolean(publish.ja, true),
          en: ensureBoolean(publish.en, false)
        },
        tags: ensureStringArray(data.tags),
        image: ensureString(data.image),
        localized: {
          ja: {
            title: ensureString(title.ja),
            summary: ensureString(summary.ja),
            body: ensureString(body.ja),
            alt: ensureString(alt.ja)
          },
          en: {
            title: ensureString(title.en),
            summary: ensureString(summary.en),
            body: ensureString(body.en),
            alt: ensureString(alt.en)
          }
        }
      };
    };

    var statusMap = {
      draft: { label: '下書き', badge: 'draft' },
      reviewing: { label: 'レビュー中', badge: 'reviewing' },
      published: { label: '公開済み', badge: 'published' }
    };

    var deviceOptionsMaster = [
      { id: 'desktop', label: 'デスクトップ' },
      { id: 'mobile', label: 'モバイル' }
    ];

    var MetadataList = function MetadataList(_ref) {
      var items = _ref.items;
      var children = [];
      (items || []).forEach(function (item, index) {
        children.push(h('dt', { key: 'meta-label-' + index, className: 'edit-preview__meta-label' }, item.label));
        var valueContent = item.value;
        if (Array.isArray(valueContent)) {
          valueContent = valueContent.join(' / ');
        }
        if (typeof valueContent === 'string' && valueContent.length === 0) {
          valueContent = '未設定';
        }
        children.push(h('dd', { key: 'meta-value-' + index, className: 'edit-preview__meta-value' }, valueContent || '未設定'));
      });
      return h('dl', { className: 'edit-preview__meta-list' }, children);
    };

    var ToggleGroup = function ToggleGroup(props) {
      var label = props.label;
      var options = props.options || [];
      var value = props.value;
      var onChange = props.onChange;

      return h('div', { className: 'edit-preview__toggle-group' },
        label ? h('span', { className: 'edit-preview__toggle-label' }, label) : null,
        h('div', { className: 'edit-preview__toggle-options' },
          options.map(function (option) {
            var isActive = option.id === value;
            var isDisabled = option.enabled === false;
            var handleClick = function handleClick() {
              if (isDisabled) {
                return;
              }
              if (typeof onChange === 'function') {
                onChange(option.id);
              }
            };
            return h('button', {
              key: option.id,
              type: 'button',
              className: classNames('edit-preview__toggle', isActive ? 'is-active' : '', isDisabled ? 'is-disabled' : ''),
              onClick: handleClick,
              disabled: isDisabled
            }, option.label);
          })
        )
      );
    };

    var PreviewLayout = function PreviewLayout(props) {
      var status = props.status;
      var statusLabel = props.statusLabel;
      var slug = props.slug;
      var date = props.date;
      var languageOptions = props.languageOptions;
      var content = props.children;
      var deviceOptions = props.deviceOptions;
      var device = props.device;
      var onDeviceChange = props.onDeviceChange;
      var onLanguageChange = props.onLanguageChange;
      var language = props.language;
      var sidebarItems = props.sidebarItems || [];

      return h('div', { className: 'edit-preview' },
        h('header', { className: 'edit-preview__header' },
          h('div', { className: 'edit-preview__header-info' },
            h('span', { className: classNames('edit-preview__badge', 'is-' + status) }, statusLabel),
            h('div', { className: 'edit-preview__header-meta' },
              h('span', null, slug ? 'Slug: ' + slug : 'Slug 未設定'),
              h('span', null, '公開日: ' + (date || '未設定'))
            )
          ),
          h('div', { className: 'edit-preview__header-controls' },
            h(ToggleGroup, {
              key: 'language',
              label: '言語',
              options: languageOptions,
              value: language,
              onChange: onLanguageChange
            }),
            h(ToggleGroup, {
              key: 'device',
              label: 'デバイス',
              options: deviceOptions,
              value: device,
              onChange: onDeviceChange
            })
          )
        ),
        h('div', { className: 'edit-preview__content' },
          sidebarItems.length > 0 ? h('aside', { className: 'edit-preview__sidebar' }, h(MetadataList, { items: sidebarItems })) : null,
          h('section', { className: classNames('edit-preview__stage', 'is-' + device) }, content)
        )
      );
    };

    var NewsPreview = function NewsPreview(props) {
      var entry = props.entry;
      var raw = entry && typeof entry.getIn === 'function' ? entry.getIn(['data']).toJS() : {};
      var news = normaliseNews(raw);

      var languageOptions = useMemo(function () {
        return [
          { id: 'ja', label: '日本語', enabled: news.publish.ja },
          { id: 'en', label: 'English', enabled: news.publish.en }
        ];
      }, [news.publish.ja, news.publish.en]);

      var fallbackLanguage = languageOptions.find(function (option) { return option.enabled; });
      var initialLanguage = fallbackLanguage ? fallbackLanguage.id : 'ja';
      var _useState = useState(initialLanguage);
      var language = _useState[0];
      var setLanguage = _useState[1];

      useEffect(function () {
        var stillValid = languageOptions.some(function (option) {
          return option.id === language && option.enabled;
        });
        if (!stillValid) {
          setLanguage(initialLanguage);
        }
      }, [languageOptions, language, initialLanguage]);

      var _useState2 = useState('desktop');
      var device = _useState2[0];
      var setDevice = _useState2[1];

      var status = statusMap[news.status] || statusMap.draft;
      var activeLanguage = languageOptions.some(function (option) {
        return option.id === language && option.enabled;
      }) ? language : initialLanguage;

      var translation = news.localized[activeLanguage] || news.localized[initialLanguage] || news.localized.ja;
      var sidebarItems = [
        { label: '公開状態', value: status.label },
        { label: '公開言語', value: languageOptions.filter(function (option) { return option.enabled; }).map(function (option) { return option.label; }) },
        { label: '固定表示', value: news.pinned ? 'ON' : 'OFF' },
        { label: 'タグ', value: news.tags.length ? news.tags.join(', ') : '' },
        { label: '公開日', value: formatDate(news.date) }
      ];

      var coverImage = news.image ? h('div', { className: 'edit-preview__cover' }, h('img', { src: news.image, alt: translation.alt || 'ニュースのカバー画像' })) : null;

      var titleContent = translation.title || (activeLanguage === 'ja' ? 'タイトル未入力' : 'Title not set');
      var summaryContent = translation.summary || '';
      var bodyContent = translation.body || '';

      var article = h('article', { className: 'edit-preview__article' },
        coverImage,
        h('header', null,
          h('h1', { className: 'edit-preview__article-title' }, titleContent)
        ),
        summaryContent ? h('p', { className: 'edit-preview__article-summary' }, summaryContent) : null,
        bodyContent ? h('div', { className: 'edit-preview__article-body' }, bodyContent) : h('div', { className: 'edit-preview__empty-hint' }, '本文が未入力です。左側のフォームで内容を作成してください。')
      );

      return h(PreviewLayout, {
        status: status.badge,
        statusLabel: status.label,
        slug: news.slug,
        date: formatDate(news.date),
        languageOptions: languageOptions,
        language: activeLanguage,
        onLanguageChange: setLanguage,
        deviceOptions: deviceOptionsMaster,
        device: device,
        onDeviceChange: setDevice,
        sidebarItems: sidebarItems
      }, article);
    };

    window.EditModePreview = window.EditModePreview || {};
    window.EditModePreview.PreviewLayout = PreviewLayout;
    window.EditModePreview.ToggleGroup = ToggleGroup;
    window.EditModePreview.classNames = classNames;

    CMS.registerPreviewStyle('/admin/preview.css');
    CMS.registerPreviewTemplate('news', NewsPreview);
  };

  if (window.CMS) {
    register();
  } else {
    document.addEventListener('CMSLoaded', register);
  }
})();

