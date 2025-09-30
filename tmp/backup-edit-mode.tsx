import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'

type Lang = 'ja' | 'en'

export function EditModePage() {
  const [lang, setLang] = useState<Lang>('ja')
  const [publishJA, setPublishJA] = useState(true)
  const [publishEN, setPublishEN] = useState(false)

  const [slug, setSlug] = useState('')
  const [date, setDate] = useState('')
  const [titleJA, setTitleJA] = useState('')
  const [summaryJA, setSummaryJA] = useState('')
  const [bodyJA, setBodyJA] = useState('')
  const [titleEN, setTitleEN] = useState('')
  const [summaryEN, setSummaryEN] = useState('')
  const [bodyEN, setBodyEN] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [altJA, setAltJA] = useState('')
  const [altEN, setAltEN] = useState('')

  const [status, setStatus] = useState<'draft' | 'reviewing' | 'published'>('draft')
  const [errors, setErrors] = useState<string[]>([])
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')

  const canPublish = useMemo(() => {
    return status !== 'draft' && validate().length === 0
  }, [status, slug, date, publishJA, publishEN, titleJA, titleEN, altJA, altEN])

  const DRAFT_KEY = 'editmode:news:draft'

  function toSlug(input: string) {
    return input
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
  }

  function validate(): string[] {
    const errs: string[] = []
    if (!/^([a-z0-9-]{1,80})$/.test(slug)) errs.push('slug は a-z0-9- のみで80文字以内')
    if (publishJA) {
      if (!titleJA) errs.push('日本語タイトルは必須')
      if (!altJA) errs.push('日本語altは必須')
    }
    if (publishEN) {
      if (!titleEN) errs.push('英語タイトルは必須')
      if (!altEN) errs.push('英語altは必須')
    }
    return errs
  }

  function saveDraft() {
    const draft = {
      slug, date, status, publishJA, publishEN,
      titleJA, summaryJA, bodyJA, titleEN, summaryEN, bodyEN,
      imageUrl, altJA, altEN
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  }

  function loadDraft() {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return
    try {
      const d = JSON.parse(raw)
      setSlug(d.slug || '')
      setDate(d.date || '')
      setStatus(d.status || 'draft')
      setPublishJA(!!d.publishJA)
      setPublishEN(!!d.publishEN)
      setTitleJA(d.titleJA || '')
      setSummaryJA(d.summaryJA || '')
      setBodyJA(d.bodyJA || '')
      setTitleEN(d.titleEN || '')
      setSummaryEN(d.summaryEN || '')
      setBodyEN(d.bodyEN || '')
      setImageUrl(d.imageUrl || '')
      setAltJA(d.altJA || '')
      setAltEN(d.altEN || '')
    } catch {}
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY)
  }

  function handleAutoSlug(from: string) {
    const s = toSlug(from)
    if (!slug || slug === toSlug(titleJA) || slug === toSlug(titleEN)) setSlug(s)
  }

  // keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault(); saveDraft();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter')) {
        e.preventDefault(); setStatus('reviewing')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [saveDraft])

  // initial load
  useEffect(() => { loadDraft() }, [])

  useEffect(() => { setErrors(validate()) }, [slug, date, publishJA, publishEN, titleJA, titleEN, altJA, altEN])

  const preview = useMemo(() => {
    const t = lang === 'ja' ? titleJA : titleEN
    const s = lang === 'ja' ? summaryJA : summaryEN
    const b = lang === 'ja' ? bodyJA : bodyEN
    const md = (b || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`{3}[\s\S]*?`{3}/g, m => `<pre class="rounded bg-muted p-3">${m.slice(3,-3)}</pre>`)
      .replace(/\n\n/g, '</p><p>').replace(/\n/g,'<br/>')
    return { t: t || '（タイトル未入力）', s, md }
  }, [lang, titleJA, titleEN, summaryJA, summaryEN, bodyJA, bodyEN])

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Edit Mode</h1>
          <p className="text-muted-foreground">ニュース編集（shadcn/ui）</p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">公開設定</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[360px] sm:w-[420px]">
              <SheetHeader>
                <SheetTitle>公開設定</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="grid gap-2">
                  <Label>ステータス</Label>
                  <div className="flex gap-2">
                    <Button size="sm" variant={status==='draft'?'default':'outline'} onClick={()=>setStatus('draft')}>Draft</Button>
                    <Button size="sm" variant={status==='reviewing'?'default':'outline'} onClick={()=>setStatus('reviewing')}>Reviewing</Button>
                    <Button size="sm" variant={status==='published'?'default':'outline'} onClick={()=>setStatus('published')}>Published</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">日本語を公開</span>
                  <Switch checked={publishJA} onCheckedChange={setPublishJA} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">英語を公開</span>
                  <Switch checked={publishEN} onCheckedChange={setPublishEN} />
                </div>
                <Separator />
                <div className="grid gap-2">
                  <Label htmlFor="slug">スラッグ</Label>
                  <Input id="slug" value={slug} onChange={e=>setSlug(e.target.value)} placeholder="my-post" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">公開日</Label>
                  <Input id="date" type="date" value={date} onChange={e=>setDate(e.target.value)} />
                </div>
                {errors.length>0 && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/5 text-destructive text-sm p-3">
                    {errors.map((er,i)=>(<div key={i}>• {er}</div>))}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Button onClick={saveDraft} variant="secondary">下書き保存 (Ctrl/Cmd+S)</Button>
          <Button disabled={!canPublish}>公開 (Ctrl/Cmd+Enter)</Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="rounded-md border">
        <ResizablePanel defaultSize={42} minSize={30} className="bg-background">
          <ScrollArea className="h-[calc(100vh-220px)] p-4">
            <div className="grid gap-2 mb-4">
              <Label>画像URL</Label>
              <Input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="/images/uploads/thumbnail.webp" />
            </div>
            <Tabs value={lang} onValueChange={(v)=>setLang(v as Lang)}>
              <TabsList>
                <TabsTrigger value="ja">本文（JA）</TabsTrigger>
                <TabsTrigger value="en">Body (EN)</TabsTrigger>
              </TabsList>
              <TabsContent value="ja" className="mt-4 space-y-3">
                <div className="grid gap-2">
                  <Label htmlFor="title-ja">タイトル（JA）</Label>
                  <Input id="title-ja" value={titleJA} onChange={e=>{setTitleJA(e.target.value); handleAutoSlug(e.target.value)}} placeholder="記事タイトル" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="summary-ja">サマリー（JA）</Label>
                  <Textarea id="summary-ja" rows={3} value={summaryJA} onChange={e=>setSummaryJA(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="body-ja">本文（Markdown）</Label>
                  <Textarea id="body-ja" rows={14} value={bodyJA} onChange={e=>setBodyJA(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="alt-ja">代替テキスト（JA）</Label>
                  <Input id="alt-ja" value={altJA} onChange={e=>setAltJA(e.target.value)} />
                </div>
              </TabsContent>
              <TabsContent value="en" className="mt-4 space-y-3">
                <div className="grid gap-2">
                  <Label htmlFor="title-en">Title (EN)</Label>
                  <Input id="title-en" value={titleEN} onChange={e=>{setTitleEN(e.target.value); handleAutoSlug(e.target.value)}} placeholder="Post title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="summary-en">Summary (EN)</Label>
                  <Textarea id="summary-en" rows={3} value={summaryEN} onChange={e=>setSummaryEN(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="body-en">Body (Markdown)</Label>
                  <Textarea id="body-en" rows={14} value={bodyEN} onChange={e=>setBodyEN(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="alt-en">Alt text (EN)</Label>
                  <Input id="alt-en" value={altEN} onChange={e=>setAltEN(e.target.value)} />
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={58} minSize={30} className="bg-muted/20">
          <div className="h-[52px] px-4 flex items-center justify-between border-b bg-background">
            <div className="text-sm text-muted-foreground">ライブプレビュー</div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant={device==='desktop'?'default':'outline'} onClick={()=>setDevice('desktop')}>Desktop</Button>
              <Button size="sm" variant={device==='mobile'?'default':'outline'} onClick={()=>setDevice('mobile')}>Mobile</Button>
              <Button size="sm" variant="outline" onClick={()=>setLang('ja')}>JA</Button>
              <Button size="sm" variant="outline" onClick={()=>setLang('en')}>EN</Button>
            </div>
          </div>
          <div className={`p-6 ${device==='mobile'?'max-w-[420px]':''}`}>
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              {imageUrl && (<div className="aspect-[16/9] rounded-md overflow-hidden bg-muted"><img src={imageUrl} alt={(lang==='ja'?altJA:altEN)||'thumbnail'} className="w-full h-full object-cover" /></div>)}
              <h2 className="mt-4 text-xl font-semibold tracking-tight">{preview.t}</h2>
              {preview.s && <p className="mt-2 text-sm text-muted-foreground">{preview.s}</p>}
              <div className="mt-4 text-sm leading-7 text-foreground" dangerouslySetInnerHTML={{__html:`<p>${preview.md}</p>`}} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

