import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  ArrowLeft,
  CalendarIcon, 
  Eye,
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Upload
} from 'lucide-react';
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
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>('draft');

  const updateField = (field: keyof NewsItem, value: any) => {
    setEditingItem(prev => ({ ...prev, [field]: value }));
  };

  const updateLocalizedField = (field: 'title' | 'summary' | 'body' | 'alt' | 'ogTitle' | 'ogDescription', language: Language, value: string) => {
    setEditingItem(prev => ({
      ...prev,
      [field]: { ...prev[field], [language]: value }
    }));
  };

  const updatePublishLanguage = (language: Language, value: boolean) => {
    setEditingItem(prev => ({
      ...prev,
      publish: { ...prev.publish, [language]: value }
    }));
  };

  const handleSave = () => {
    const finalItem = {
      ...editingItem,
      published: publishStatus === 'published'
    };
    onSave(finalItem);
  };

  const isRequiredFieldFilled = (language: Language) => !!(editingItem.title[language] && editingItem.summary[language]);\n  const bothLanguagesFilled = () => (isRequiredFieldFilled('ja') && isRequiredFieldFilled('en'));\n  React.useEffect(() => { if (previewLanguage !== activeLanguage) setPreviewLanguage(activeLanguage); }, [activeLanguage]);\n  React.useEffect(() => { if (activeLanguage !== previewLanguage) setActiveLanguage(previewLanguage); }, [previewLanguage]);\n  };

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
                  <h1 className="text-xl font-semibold">繝九Η繝ｼ繧ｹ邱ｨ髮・/h1>
                </div>
              </div>

              {/* Header Controls */}
              <div className="grid grid-cols-4 gap-4">
                {/* Publication Status */}
                <div className="space-y-2">
                  <Label className="text-sm">蜈ｬ髢狗憾諷・/Label>
                  <Select value={publishStatus} onValueChange={(value) => setPublishStatus(value as 'draft' | 'published')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">荳区嶌縺・/SelectItem>
                      <SelectItem value="published">蜈ｬ髢・/SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Update Date */}
                <div className="space-y-2">
                  <Label className="text-sm">譖ｴ譁ｰ譌･</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {new Date().toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
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
                  <Label className="text-sm">繧ｿ繧ｰ</Label>
                  <Input
                    value={editingItem.tags.join(', ')}
                    onChange={(e) => updateField('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    placeholder="AI, Research"
                    className="text-sm"
                  />
                </div>

                {/* Publish Languages removed: JA/EN both required */\n                </div>
                </div>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="space-y-8">
                  {/* Thumbnail Image */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">繧ｵ繝繝阪う繝ｫ逕ｻ蜒・/Label>
                    <div className="w-full h-64 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                      {editingItem.image ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={editingItem.image} 
                            alt="繧ｵ繝繝阪う繝ｫ" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => updateField('image', '')}
                            className="absolute top-2 right-2"
                          >
                            蜑企勁
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center space-y-3">
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                          <div>
                            <p className="text-lg font-medium text-foreground">逕ｻ蜒上ｒ繧｢繝・・繝ｭ繝ｼ繝・/p>
                            <p className="text-sm text-muted-foreground">繧ｯ繝ｪ繝・け縺ｾ縺溘・繝峨Λ繝・げ&繝峨Ο繝・・縺励※逕ｻ蜒上ｒ驕ｸ謚・/p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Tabs */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">蝓ｷ遲・ｨ隱・/Label>
                    <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as Language)}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="ja" className="flex items-center gap-2">
                          譌･譛ｬ隱・                          {editingItem.publish.ja && !isRequiredFieldFilled('ja') && (
                            <div className="w-2 h-2 bg-destructive rounded-full" />
                          )}
                        </TabsTrigger>
                        <TabsTrigger value="en" className="flex items-center gap-2">
                          English
                          {editingItem.publish.en && !isRequiredFieldFilled('en') && (
                            <div className="w-2 h-2 bg-destructive rounded-full" />
                          )}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="ja" className="space-y-6 mt-6">
                        <div className="space-y-3">
                          <Label htmlFor="title-ja" className="text-base font-medium">繧ｿ繧､繝医Ν</Label>
                          <Input
                            id="title-ja"
                            value={editingItem.title.ja || ''}
                            onChange={(e) => updateLocalizedField('title', 'ja', e.target.value)}
                            placeholder="讎りｦ√ｒ蜈･蜉幢ｼ・0蟄礼ｨ句ｺｦ・・
                            className="text-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="body-ja" className="text-base font-medium">譛ｬ譁・/Label>
                          <Textarea
                            id="body-ja"
                            value={editingItem.body.ja || ''}
                            onChange={(e) => updateLocalizedField('body', 'ja', e.target.value)}
                            placeholder="譛ｬ譁・ｒ蜈･蜉帙＠縺ｦ縺上□縺輔＞..."
                            rows={20}
                            className="min-h-[500px] resize-none text-base leading-relaxed"
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="en" className="space-y-6 mt-6">
                        <div className="space-y-3">
                          <Label htmlFor="title-en" className="text-base font-medium">Title</Label>
                          <Input
                            id="title-en"
                            value={editingItem.title.en || ''}
                            onChange={(e) => updateLocalizedField('title', 'en', e.target.value)}
                            placeholder="Enter title (about 50 characters)"
                            className="text-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="body-en" className="text-base font-medium">Body</Label>
                          <Textarea
                            id="body-en"
                            value={editingItem.body.en || ''}
                            onChange={(e) => updateLocalizedField('body', 'en', e.target.value)}
                            placeholder="Enter body content..."
                            rows={20}
                            className="min-h-[500px] resize-none text-base leading-relaxed"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Save Buttons */}
                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setPublishStatus('draft');
                        handleSave();
                      }}
                      size="lg"
                    >
                      荳区嶌縺堺ｿ晏ｭ・                    </Button>
                    <Button 
                      onClick={() => {
                        setPublishStatus('published');
                        handleSave();
                      }}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      蜈ｬ髢・                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ResizablePanel>

        <ResizableHandle withHandle />
        
        {/* Right Panel - Preview */}
        <ResizablePanel defaultSize={35} minSize={25}>
          <section className="flex flex-col overflow-hidden h-full">
            <div className="flex items-center justify-between p-4 border-b flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="font-medium">繝励Ξ繝薙Η繝ｼ</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <Button
                    variant={previewLanguage === 'ja' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewLanguage('ja')}
                  >
                    譌･譛ｬ隱・                  </Button>
                  <Button
                    variant={previewLanguage === 'en' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewLanguage('en')}
                  >
                    English
                  </Button>
                </div>
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <Button
                    variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewDevice('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewDevice('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <Button
                    variant={previewTheme === 'light' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewTheme('light')}
                  >
                    <Sun className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewTheme === 'dark' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewTheme('dark')}
                  >
                    <Moon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              <div 
                className={`${previewDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'} ${previewTheme === 'dark' ? 'dark' : ''}`}
              >
                <NewsPreview 
                  item={editingItem} 
                  language={previewLanguage}
                  theme={previewTheme}
                />
              </div>
            </div>
          </section>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
