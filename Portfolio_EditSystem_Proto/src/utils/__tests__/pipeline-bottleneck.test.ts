import { runPipeline, pickNodeTypes } from '../../utils/pipeline-debug'

type Fixture = {
  name: string
  markdown: string
  expectHtml: (string | RegExp)[]
  expectTypes: string[]
}

const cases: Fixture[] = [
  {
    name: 'Headings H1-H3',
    markdown: ['# H1', '## H2', '### H3'].join('\n\n'),
    expectHtml: [/<h1[^>]*>/, /<h2[^>]*>/, /<h3[^>]*>/],
    expectTypes: ['heading', 'heading', 'heading'],
  },
  {
    name: 'Bullet list',
    markdown: ['- a', '- b', '- c'].join('\n'),
    expectHtml: [/<ul[^>]*>/, /<li[^>]*>/],
    expectTypes: ['bulletList', 'listItem'],
  },
  {
    name: 'Ordered list',
    markdown: ['1. one', '2. two', '3. three'].join('\n'),
    expectHtml: [/(<ol|<ul)[^>]*>/, /<li[^>]*>/],
    expectTypes: ['listItem'],
  },
  {
    name: 'Blockquote',
    markdown: '> quote',
    expectHtml: [/<blockquote[^>]*>/],
    expectTypes: ['blockquote'],
  },
  {
    name: 'Inline strong/em',
    markdown: '**bold** and *em*',
    expectHtml: [/<strong[^>]*>/, /<em[^>]*>/],
    expectTypes: ['paragraph', 'text'],
  },
]

function assertAll(html: string, pats: (string | RegExp)[]) {
  for (const p of pats) {
    if (typeof p === 'string') expect(html).toContain(p)
    else expect(html).toMatch(p)
  }
}

describe('Pipeline bottleneck probe', () => {
  test.each(cases)('%s', ({ markdown, expectHtml, expectTypes }) => {
    const out = runPipeline(markdown)

    assertAll(out.html1, expectHtml)

    const types = pickNodeTypes(out.json)
    for (const t of expectTypes) expect(types).toContain(t)

    assertAll(out.html2, expectHtml)
    assertAll(out.sanitized, expectHtml)
  })

  test('XSS sanitize', () => {
    const out = runPipeline('<img src=x onerror=alert(1)>')
    expect(out.sanitized).not.toContain('onerror=')
  })
})

