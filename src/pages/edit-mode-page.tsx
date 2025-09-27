import { useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

type Lang = 'ja' | 'en'

export function EditModePage(){
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

  const [status, setStatus] = useState<'draft'|'reviewing'|'published'>('draft')
  const [errors, setErrors] = useState<string[]>([])

  function toSlug(input:string){
    return input.toLowerCase().normalize('NFKD')
      .replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-')
      .replace(/-+/g,'-').replace(/^-+|-+$/g,'').slice(0,80)
  }
  function validate(){
    const errs:string[]=[]
    if(!/^([a-z0-9-]{1,80})$/.test(slug)) errs.push('slugはa-z0-9-のみ/80文字以内')
    if(publishJA){ if(!titleJA) errs.push('日本語タイトル必須'); if(!altJA) errs.push('日本語alt必須') }
    if(publishEN){ if(!titleEN) errs.push('英語タイトル必須'); if(!altEN) errs.push('英語alt必須') }
    return errs
  }
  useEffect(()=>{ setErrors(validate()) },[slug,date,publishJA,publishEN,titleJA,titleEN,altJA,altEN])

  const preview = useMemo(()=>{
    const t = lang==='ja'?titleJA:titleEN
    const s = lang==='ja'?summaryJA:summaryEN
    const b = lang==='ja'?bodyJA:bodyEN
    const md = (b||'').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.*?)\*/g,'<em>$1</em>')
      .replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br/>')
    return {t: t||'（タイトル未入力）', s, md}
  },[lang,titleJA,titleEN,summaryJA,summaryEN,bodyJA,bodyEN])

  function handleAutoSlug(src:string){
    const s = toSlug(src); if(!slug||slug===toSlug(titleJA)||slug===toSlug(titleEN)) setSlug(s)
  }

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Edit Mode</h1>
          <p className="text-muted-foreground">ニュース編集（shadcn/ui）</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={status==='draft'?'default':'outline'} onClick={()=>setStatus('draft')}>Draft</Button>
          <Button variant={status==='reviewing'?'default':'outline'} onClick={()=>setStatus('reviewing')}>Reviewing</Button>
          <Button variant={status==='published'?'default':'outline'} onClick={()=>setStatus('published')}>Published</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* 左ペイン：フォーム */}
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label>スラッグ</Label>
            <Input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="my-post" />
          </div>
          <div className="grid gap-2">
            <Label>公開日</Label>
            <Input type="date" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>画像URL</Label>
            <Input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="/images/uploads/thumbnail.webp" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm">日本語を公開</span>
            <Switch checked={publishJA} onCheckedChange={setPublishJA} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">英語を公開</span>
            <Switch checked={publishEN} onCheckedChange={setPublishEN} />
          </div>

          <Tabs value={lang} onValueChange={v=>setLang(v as Lang)}>
            <TabsList>
              <TabsTrigger value="ja">本文（JA）</TabsTrigger>
              <TabsTrigger value="en">Body (EN)</TabsTrigger>
            </TabsList>
            <TabsContent value="ja" className="mt-3 space-y-3">
              <div className="grid gap-2">
                <Label>タイトル（JA）</Label>
                <Input value={titleJA} onChange={e=>{setTitleJA(e.target.value); handleAutoSlug(e.target.value)}} />
              </div>
              <div className="grid gap-2">
                <Label>サマリー（JA）</Label>
                <Textarea rows={3} value={summaryJA} onChange={e=>setSummaryJA(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>本文（Markdown）</Label>
                <Textarea rows={12} value={bodyJA} onChange={e=>setBodyJA(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>代替テキスト（JA）</Label>
                <Input value={altJA} onChange={e=>setAltJA(e.target.value)} />
              </div>
            </TabsContent>
            <TabsContent value="en" className="mt-3 space-y-3">
              <div className="grid gap-2">
                <Label>Title (EN)</Label>
                <Input value={titleEN} onChange={e=>{setTitleEN(e.target.value); handleAutoSlug(e.target.value)}} />
              </div>
              <div className="grid gap-2">
                <Label>Summary (EN)</Label>
                <Textarea rows={3} value={summaryEN} onChange={e=>setSummaryEN(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Body (Markdown)</Label>
                <Textarea rows={12} value={bodyEN} onChange={e=>setBodyEN(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Alt text (EN)</Label>
                <Input value={altEN} onChange={e=>setAltEN(e.target.value)} />
              </div>
            </TabsContent>
          </Tabs>

          {errors.length>0 && (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 text-destructive text-sm p-3">
              {errors.map((er,i)=>(<div key={i}>• {er}</div>))}
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="secondary">下書き保存</Button>
            <Button disabled={status==='draft' || errors.length>0}>公開</Button>
          </div>
        </div>

        {/* 右ペイン：プレビュー */}
        <div className="space-y-3">
          {imageUrl && (
            <div className="aspect-[16/9] rounded-md overflow-hidden bg-muted">
              <img src={imageUrl} alt={(lang==='ja'?altJA:altEN)||'thumbnail'} className="w-full h-full object-cover" />
            </div>
          )}
          <h2 className="text-xl font-semibold tracking-tight">{preview.t}</h2>
          {preview.s && <p className="text-sm text-muted-foreground">{preview.s}</p>}
          <div className="text-sm leading-7" dangerouslySetInnerHTML={{__html:`<p>${preview.md}</p>`}} />
        </div>
      </div>
    </div>
  )
}
