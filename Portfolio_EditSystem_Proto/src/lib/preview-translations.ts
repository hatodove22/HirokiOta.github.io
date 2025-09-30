import { getTranslations } from '../../../src/lib/i18n'

import { Language } from '../types/content'

const fallbackPreviewTexts = {
  ja: {
    title: 'プレビュー',
    showButton: 'プレビューを表示',
    hideButton: 'プレビューを非表示',
    pinnedLabel: 'ピン留め',
    newsLabel: 'ニュース',
    emptyState: 'プレビューする内容がありません',
    languageBadges: {
      ja: '日本語',
      en: '英語',
    },
    languageToggle: {
      ja: 'JA',
      en: 'EN',
    },
  },
  en: {
    title: 'Preview',
    showButton: 'Show Preview',
    hideButton: 'Hide Preview',
    pinnedLabel: 'Pinned',
    newsLabel: 'News',
    emptyState: 'No content to preview',
    languageBadges: {
      ja: 'Japanese',
      en: 'English',
    },
    languageToggle: {
      ja: 'JA',
      en: 'EN',
    },
  },
} as const

const fallbackEditorTexts = {
  ja: {
    heading: 'ニュース編集',
    status: {
      label: 'ステータス',
      options: {
        draft: '下書き',
        published: '公開',
      },
    },
    updatedDate: '更新日',
    tags: {
      label: 'タグ（カンマ区切り）',
      placeholder: 'AI, リサーチ, 機械学習',
    },
    thumbnail: {
      label: 'サムネイル画像',
      emptyTitle: '画像をアップロード',
      emptySubtitle: 'クリックまたはドラッグ＆ドロップで画像を選択',
      remove: '削除',
    },
    language: {
      label: '言語',
      tabs: {
        ja: '日本語',
        en: '英語',
      },
      requiredBadge: '必須',
    },
    fields: {
      title: {
        label: { ja: 'タイトル（日本語）', en: 'タイトル（英語）' },
        placeholder: { ja: '日本語のタイトルを入力（〜50文字）', en: '英語のタイトルを入力（〜50文字）' },
      },
      summary: {
        label: { ja: '概要（日本語）', en: '概要（英語）' },
        placeholder: { ja: '日本語の概要を入力', en: '英語の概要を入力' },
      },
      body: {
        label: { ja: '本文（日本語）', en: '本文（英語）' },
        placeholder: { ja: '日本語の本文を入力', en: '英語の本文を入力' },
      },
    },
    actions: {
      saveDraft: '下書き保存',
      publish: '公開',
    },
  },
  en: {
    heading: 'News Editor',
    status: {
      label: 'Status',
      options: {
        draft: 'Draft',
        published: 'Published',
      },
    },
    updatedDate: 'Updated Date',
    tags: {
      label: 'Tags (comma separated)',
      placeholder: 'AI, Research, Machine Learning',
    },
    thumbnail: {
      label: 'Thumbnail Image',
      emptyTitle: 'Upload image',
      emptySubtitle: 'Click or drag & drop to select an image',
      remove: 'Remove',
    },
    language: {
      label: 'Language',
      tabs: {
        ja: 'JA',
        en: 'EN',
      },
      requiredBadge: 'Required',
    },
    fields: {
      title: {
        label: { ja: 'Title (JA)', en: 'Title (EN)' },
        placeholder: { ja: 'Enter Japanese title (up to ~50 chars)', en: 'Enter English title (up to ~50 chars)' },
      },
      summary: {
        label: { ja: 'Summary (JA)', en: 'Summary (EN)' },
        placeholder: { ja: 'Enter Japanese summary', en: 'Enter English summary' },
      },
      body: {
        label: { ja: 'Body (JA)', en: 'Body (EN)' },
        placeholder: { ja: 'Write body content in Japanese', en: 'Write body content in English' },
      },
    },
    actions: {
      saveDraft: 'Save Draft',
      publish: 'Publish',
    },
  },
} as const

const rawJa = (getTranslations('ja') as any).edit ?? {}
const rawEn = (getTranslations('en') as any).edit ?? {}

export const previewTexts = {
  ja: rawJa.preview ?? fallbackPreviewTexts.ja,
  en: rawEn.preview ?? fallbackPreviewTexts.en,
} as const

export const editorTexts = {
  ja: rawJa.editor ?? fallbackEditorTexts.ja,
  en: rawEn.editor ?? fallbackEditorTexts.en,
} as const

export const getPreviewText = (language: Language) => previewTexts[language]

export const getEditorText = (language: Language) => editorTexts[language]
