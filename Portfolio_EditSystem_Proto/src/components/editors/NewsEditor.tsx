import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, CalendarIcon, Eye, EyeOff, Monitor, Smartphone, Sun, Moon } from 'lucide-react';
import { NewsItem, Language } from '../../types/content';
import { NewsPreview } from '../previews/NewsPreview';

interface NewsEditorProps {
  item: NewsItem;
  onSave: (item: NewsItem) => void;
  onCancel: () => void;
}

export function NewsEditor({ item, onSave, onCancel }: NewsEditorProps) {
  const [editingItem, setEditingItem] = useState<NewsItem>(item);
  const [activeLanguage, setActiveLanguage] = useState<Language>('ja');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [previewLanguage, setPreviewLanguage] = useState<Language>('ja');
  const [showPreview, setShowPreview] = useState(true);
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>(item.published ? 'published' : 'draft');

  const updateField = (field: keyof NewsItem, value: any) => {
    setEditingItem(prev => ({ ...prev, [field]: value }));
  };

  const updateLocalizedField = (
    field: 'title' | 'summary' | 'body' | 'alt' | 'ogTitle' | 'ogDescription',
    language: Language,
    value: string
  ) => {
    setEditingItem(prev => ({
      ...prev,
      [field]: { ...prev[field], [language]: value }
    }));
  };

  const handleSave = () => {
    const finalItem: NewsItem = {
      ...editingItem,
      published: publishStatus === 'published',
      publish: { ja: true, en: true },
    };
    onSave(finalItem);
  };

  const isRequiredFieldFilled = (language: Language) => !!(editingItem.title[language] && editingItem.summary[language]);
  const bothLanguagesFilled = () => isRequiredFieldFilled('ja') && isRequiredFieldFilled('en');

  // Link writing language and preview language in both directions
  useEffect(() => {
    if (previewLanguage !== activeLanguage) setPreviewLanguage(activeLanguage);
  }, [activeLanguage, previewLanguage]);
  useEffect(() => {
    if (activeLanguage !== previewLanguage) setActiveLanguage(previewLanguage);
  }, [previewLanguage, activeLanguage]);

  return (
    <div className="w-full min-h-[100dvh] overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="w-full min-h-[100dvh]">
        {/* Left Panel - Editor */}
        <ResizablePanel defaultSize={65} minSize={45}>
          <section className="flex flex-col overflow-hidden h-full">
            {/* Header */}
            <div className="p-6 border-b bg-background">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={onCancel} className="p-2">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h1 className="text-xl font-semibold">ニュース編集</h1>
                </div>
              </div>

              {/* Header Controls */}
              <div className="grid grid-cols-4 gap-4">
                {/* Publication Status */}
                <div className="space-y-2">
                  <Label className="text-sm">公開状態</Label>
                  <Select value={publishStatus} onValueChange={(value) => setPublishStatus(value as 'draft' | 'published')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">下書き</SelectItem>
                      <SelectItem value="published">公開</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Update Date */}
                <div className="space-y-2">
                  <Label className="text-sm">更新日</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date()}
                        onSelect={(date) => date && updateField('date', date.toISOString().split('T')[0])}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="text-sm">タグ</Label>
                  <Input
                    value={editingItem.tags.join(', ')}
                    onChange={(e) => updateField('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    placeholder="AI, Research"
                    className="text-sm"
                  />
                </div>

                {/* Language toggle removed intentionally (JA/EN are both required) */}
                <div />
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="space-y-8">
                  {/* Thumbnail Image */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">サムネイル画像</Label>
                    <div className="w-full h-64 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                      {editingItem.image ? (
                        <div className="relative w-full h-full">
                          <img src={editingItem.image} alt="サムネイル" className="w-full h-full object-cover rounded-lg" />
                          <Button variant="destructive" size="sm" onClick={() => updateField('image', '')} className="absolute top-2 right-2">
                            削除
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center space-y-3">
                          <div className="text-lg font-medium text-foreground">画像をアップロード</div>
                          <div className="text-sm text-muted-foreground">クリックまたはドラッグ&ドロップで画像を選択</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Tabs */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">執筆言語</Label>
                    <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as Language)}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="ja" className="flex items-center gap-2">
                          日本語
                          {!isRequiredFieldFilled('ja') && (<Badge variant="destructive" className="ml-2">必須</Badge>)}
                        </TabsTrigger>
                        <TabsTrigger value="en" className="flex items-center gap-2">
                          English
                          {!isRequiredFieldFilled('en') && (<Badge variant="destructive" className="ml-2">Required</Badge>)}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="ja" className="space-y-6 mt-6">
                        <div className="space-y-3">
                          <Label htmlFor="title-ja" className="text-base font-medium">タイトル</Label>
                          <Input id="title-ja" value={editingItem.title.ja || ''} onChange={(e) => updateLocalizedField('title', 'ja', e.target.value)} placeholder="50字程度" className="text-lg" />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="summary-ja" className="text-base font-medium">概要</Label>
                          <Textarea id="summary-ja" rows={3} value={editingItem.summary.ja || ''} onChange={(e) => updateLocalizedField('summary', 'ja', e.target.value)} />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="body-ja" className="text-base font-medium">本文</Label>
                          <Textarea id="body-ja" rows={12} value={editingItem.body.ja || ''} onChange={(e) => updateLocalizedField('body', 'ja', e.target.value)} className="min-h-[300px] resize-none text-base leading-relaxed" />
                        </div>
                      </TabsContent>

                      <TabsContent value="en" className="space-y-6 mt-6">
                        <div className="space-y-3">
                          <Label htmlFor="title-en" className="text-base font-medium">Title</Label>
                          <Input id="title-en" value={editingItem.title.en || ''} onChange={(e) => updateLocalizedField('title', 'en', e.target.value)} placeholder="~50 chars" className="text-lg" />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="summary-en" className="text-base font-medium">Summary</Label>
                          <Textarea id="summary-en" rows={3} value={editingItem.summary.en || ''} onChange={(e) => updateLocalizedField('summary', 'en', e.target.value)} />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="body-en" className="text-base font-medium">Body</Label>
                          <Textarea id="body-en" rows={12} value={editingItem.body.en || ''} onChange={(e) => updateLocalizedField('body', 'en', e.target.value)} className="min-h-[300px] resize-none text-base leading-relaxed" />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Save Buttons */}
                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button variant="outline" onClick={() => { setPublishStatus('draft'); handleSave(); }} size="lg">下書き保存</Button>
                    <Button onClick={() => { setPublishStatus('published'); handleSave(); }} size="lg" className="bg-green-600 hover:bg-green-700 text-white" disabled={!bothLanguagesFilled()}>
                      公開
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ResizablePanel>

        {showPreview ? <ResizableHandle withHandle /> : null}

        {/* Right Panel - Preview */}
        {showPreview ? (
          <ResizablePanel defaultSize={35} minSize={25}>
            <section className="flex flex-col overflow-hidden h-full">
              <div className="flex items-center justify-between p-4 border-b flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">プレビュー</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center bg-muted rounded-lg p-1">
                    <Button variant={previewLanguage === 'ja' ? 'default' : 'ghost'} size="sm" onClick={() => setPreviewLanguage('ja')}>日本語</Button>
                    <Button variant={previewLanguage === 'en' ? 'default' : 'ghost'} size="sm" onClick={() => setPreviewLanguage('en')}>English</Button>
                  </div>
                  <div className="flex items-center bg-muted rounded-lg p-1">
                    <Button variant={previewDevice === 'desktop' ? 'default' : 'ghost'} size="sm" onClick={() => setPreviewDevice('desktop')}><Monitor className="w-4 h-4" /></Button>
                    <Button variant={previewDevice === 'mobile' ? 'default' : 'ghost'} size="sm" onClick={() => setPreviewDevice('mobile')}><Smartphone className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex items-center bg-muted rounded-lg p-1">
                    <Button variant={previewTheme === 'light' ? 'default' : 'ghost'} size="sm" onClick={() => setPreviewTheme('light')}><Sun className="w-4 h-4" /></Button>
                    <Button variant={previewTheme === 'dark' ? 'default' : 'ghost'} size="sm" onClick={() => setPreviewTheme('dark')}><Moon className="w-4 h-4" /></Button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}><EyeOff className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className={`${previewDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'} ${previewTheme === 'dark' ? 'dark' : ''}`}>
                  <NewsPreview item={editingItem} language={previewLanguage} theme={previewTheme} />
                </div>
              </div>
            </section>
          </ResizablePanel>
        ) : null}
      </ResizablePanelGroup>
    </div>
  );
}