import React from 'react'
import { render, screen } from '@testing-library/react'
import { NewsPreview } from '../../previews/NewsPreview'
import { NewsItem } from '../../../types/content'

const base: NewsItem = {
  id: 'n-1',
  slug: 'n-1',
  date: '2025-01-01',
  title: { ja: 'タイトル', en: 'Title' },
  summary: { ja: '概要', en: 'Summary' },
  body: { ja: '', en: '' },
  alt: { ja: '代替', en: 'alt' },
  tags: [],
  published: true,
  publish: { ja: true, en: true },
  pinned: false,
}

describe('NewsPreview プレビュー反映（パイプライン実働）', () => {
  test('JSON(Tiptap) 入力で H1 / 箇条書き が HTML に出る', () => {
    const doc = {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '見出し' }] },
        {
          type: 'bulletList',
          content: [
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'りんご' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'ばなな' }] }] },
          ],
        },
      ],
    }

    const item: NewsItem = {
      ...base,
      body: { ja: JSON.stringify(doc), en: '' },
    }

    render(<NewsPreview item={item} language="ja" theme="light" />)

    expect(screen.getByText('見出し')).toBeInTheDocument()
    expect(screen.getByText('りんご')).toBeInTheDocument()
    expect(screen.getByText('ばなな')).toBeInTheDocument()
  })
})
