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

  const canPublish = useMemo(() => {
    return (lang === 'ja' ? publishJA : publishEN)
  }, [lang, publishJA, publishEN])

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Edit Mode</h1>
          <p className="text-muted-foreground">ニュース/プロジェクト/論文の編集スケルトン（shadcn-ui）</p>
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
                  <Input id="slug" placeholder="2025-09-27-my-post" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">公開日</Label>
                  <Input id="date" type="date" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Button disabled={!canPublish}>公開</Button>
          <Button variant="secondary">下書き保存</Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="rounded-md border">
        <ResizablePanel defaultSize={42} minSize={30} className="bg-background">
          <ScrollArea className="h-[calc(100vh-220px)] p-4">
            <Tabs value={lang} onValueChange={(v)=>setLang(v as Lang)}>
              <TabsList>
                <TabsTrigger value="ja">本文（JA）</TabsTrigger>
                <TabsTrigger value="en">Body (EN)</TabsTrigger>
              </TabsList>
              <TabsContent value="ja" className="mt-4 space-y-3">
                <div className="grid gap-2">
                  <Label htmlFor="title-ja">タイトル（JA）</Label>
                  <Input id="title-ja" placeholder="記事タイトル" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="summary-ja">サマリー（JA）</Label>
                  <Textarea id="summary-ja" rows={3} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="body-ja">本文（Markdown）</Label>
                  <Textarea id="body-ja" rows={14} />
                </div>
              </TabsContent>
              <TabsContent value="en" className="mt-4 space-y-3">
                <div className="grid gap-2">
                  <Label htmlFor="title-en">Title (EN)</Label>
                  <Input id="title-en" placeholder="Post title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="summary-en">Summary (EN)</Label>
                  <Textarea id="summary-en" rows={3} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="body-en">Body (Markdown)</Label>
                  <Textarea id="body-en" rows={14} />
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />
            <div className="grid gap-2">
              <Label htmlFor="image">サムネイルURL</Label>
              <Input id="image" placeholder="/images/uploads/thumbnail.webp" />
              <div className="text-xs text-muted-foreground">16:9 / WebP 推奨、alt は各言語で設定</div>
            </div>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={58} minSize={30} className="bg-muted/20">
          <div className="h-[52px] px-4 flex items-center justify-between border-b bg-background">
            <div className="text-sm text-muted-foreground">ライブプレビュー</div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={()=>setLang('ja')}>JA</Button>
              <Button size="sm" variant="outline" onClick={()=>setLang('en')}>EN</Button>
            </div>
          </div>
          <div className="p-6">
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <div className="text-xs text-muted-foreground mb-2">Preview / {lang.toUpperCase()}</div>
              <div className="h-48 rounded-md bg-muted" />
              <h2 className="mt-4 text-xl font-semibold tracking-tight">タイトル（ダミー）/ Title (dummy)</h2>
              <p className="mt-2 text-sm text-muted-foreground">ここに要約のダミーが入ります。本文を入力すると置き換わります。</p>
              <div className="mt-4 text-sm leading-7 text-foreground">
                マークダウンの本文プレビュー（実装時に置換）
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
