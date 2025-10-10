import { markdownToHTML, htmlToTiptapJSON, tiptapJSONToHTML, sanitize } from './convert'

function fallbackMdToHtml(md: string): string {
  return md
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .split('\n')
    .map((line) => {
      if (line.startsWith('<h') || line.startsWith('<blockquote>')) return line
      if (line.startsWith('<li>')) return line
      return line.trim() ? `<p>${line.trim()}</p>` : ''
    })
    .filter(Boolean)
    .join('\n')
    .replace(/(<li>.*<\/li>)(\n(?=<li>))+?/g, '$1')
    .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
}

export type StageOutput = {
  html1: string
  json: any
  html2: string
  sanitized: string
}

export function runPipeline(markdown: string): StageOutput {
  let html1 = markdownToHTML(markdown)
  if (!/[<(]h[1-6]|<(ul|ol|blockquote|strong|em)/.test(html1)) {
    html1 = fallbackMdToHtml(markdown)
  }
  const json = htmlToTiptapJSON(html1)
  const html2 = tiptapJSONToHTML(json)
  const sanitized = sanitize(html2)
  return { html1, json, html2, sanitized }
}

export function pickNodeTypes(json: any): string[] {
  const types: string[] = []
  function walk(node: any) {
    if (!node || typeof node !== 'object') return
    if (node.type) types.push(node.type)
    if (Array.isArray(node.content)) node.content.forEach(walk)
  }
  walk(json)
  return types
}

if (typeof window !== 'undefined') {
  ;(window as any).__pipelineDebug = runPipeline
  ;(window as any).__pipelineNodeTypes = pickNodeTypes
}
