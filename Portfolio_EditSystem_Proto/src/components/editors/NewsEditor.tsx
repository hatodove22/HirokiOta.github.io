import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { SimpleEditor as SimpleTemplateEditor } from '../tiptap-templates/simple/simple-editor'; // Use the official template version (barrel import)
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, CalendarIcon, Eye, EyeOff, Monitor, Smartphone, Sun, Moon } from 'lucide-react';
import { cn } from '../ui/utils';
import { NewsItem, Language } from '../../types/content';
import { NewsPreview } from '../previews/NewsPreview';
import { editorTexts, getPreviewText, previewTexts } from '../../lib/preview-translations';
import { useMainContentHeader } from '../MainContentHeaderContext';

interface NewsEditorProps {
  item: NewsItem;
  onSave: (item: NewsItem) => Promise<NewsItem>;
  onCancel: () => void;
}

const editorCopy = editorTexts.ja;

const LANGUAGE_META: Record<
  Language,
  {
    tabLabel: string;
    titleLabel: string;
    summaryLabel: string;
    bodyLabel: string;
    titlePlaceholder: string;
    summaryPlaceholder: string;
    bodyPlaceholder: string;
  }
> = {
  ja: {
    tabLabel: editorCopy.language.tabs.ja,
    titleLabel: editorCopy.fields.title.label.ja,
    summaryLabel: editorCopy.fields.summary.label.ja,
    bodyLabel: editorCopy.fields.body.label.ja,
    titlePlaceholder: editorCopy.fields.title.placeholder.ja,
    summaryPlaceholder: editorCopy.fields.summary.placeholder.ja,
    bodyPlaceholder: editorCopy.fields.body.placeholder.ja,
  },
  en: {
    tabLabel: editorCopy.language.tabs.en,
    titleLabel: editorCopy.fields.title.label.en,
    summaryLabel: editorCopy.fields.summary.label.en,
    bodyLabel: editorCopy.fields.body.label.en,
    titlePlaceholder: editorCopy.fields.title.placeholder.en,
    summaryPlaceholder: editorCopy.fields.summary.placeholder.en,
    bodyPlaceholder: editorCopy.fields.body.placeholder.en,
  },
};

const previewLanguageToggleLabels = {
  ja: previewTexts.ja.languageToggle.ja,
  en: previewTexts.en.languageToggle.en,
};

export function NewsEditor({ item, onSave, onCancel }: NewsEditorProps) {
  const [editingItem, setEditingItem] = useState<NewsItem>(item);
  const [activeLanguage, setActiveLanguage] = useState<Language>('ja');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [previewLanguage, setPreviewLanguage] = useState<Language>('ja');
  const [showPreview, setShowPreview] = useState(true);
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>(item.published ? 'published' : 'draft');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setHeaderLeft, setHeaderRight } = useMainContentHeader();

  const previewCopy = getPreviewText(previewLanguage);
  const showPreviewLabel = previewCopy.showButton;
  const hidePreviewLabel = previewCopy.hideButton;

  useEffect(() => {
    const headerLeftNode = (
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-semibold">{editorCopy.heading}</h1>
      </div>
    );

    const headerRightNode = (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPreview(prev => !prev)}
        className="flex items-center gap-2"
      >
        {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        <span className="hidden sm:inline-block">
          {showPreview ? hidePreviewLabel : showPreviewLabel}
        </span>
      </Button>
    );

    setHeaderLeft(headerLeftNode);
    setHeaderRight(headerRightNode);

    return () => {
      setHeaderLeft(null);
      setHeaderRight(null);
    };
  }, [setHeaderLeft, setHeaderRight, onCancel, editorCopy.heading, showPreview, hidePreviewLabel, showPreviewLabel, previewLanguage]);
  const previewTitle = previewCopy.title;

  const updateField = (field: keyof NewsItem, value: any) => {
    setEditingItem(prev => ({ ...prev, [field]: value }));
  };

  const updateLocalizedField = (
    field: 'title' | 'summary' | 'body' | 'alt' | 'ogTitle' | 'ogDescription',
    language: Language,
    value: string,
  ) => {
    setEditingItem(prev => ({
      ...prev,
      [field]: { ...prev[field], [language]: value },
    }));
  };

  const handleSave = async (nextStatus: 'draft' | 'published') => {
    if (isSubmitting) {
      return;
    }
    setPublishStatus(nextStatus);

    const finalItem: NewsItem = {
      ...editingItem,
      published: nextStatus === 'published',
      publish: { ja: true, en: true },
    };

    setIsSubmitting(true);
    try {
      const savedItem = await onSave(finalItem);
      setEditingItem(savedItem);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    const lang = value as Language;
    setActiveLanguage(lang);
    setPreviewLanguage(lang);
  };

  const handlePreviewLanguageChange = (lang: Language) => {
    setPreviewLanguage(lang);
    setActiveLanguage(lang);
  };

  const isRequiredFieldFilled = (language: Language) =>
    Boolean(editingItem.title[language] && editingItem.summary[language]);

  const bothLanguagesFilled = () => isRequiredFieldFilled('ja') && isRequiredFieldFilled('en');

    return (
    <div className="relative w-full min-h-[100dvh] bg-background">
<main className="px-4 pb-12 pt-6 md:px-6">
  <div
    className={cn(
      'mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start',
      !showPreview && 'md:max-w-3xl',
    )}
  >
    <section className="flex-1 space-y-6">
      <div className="rounded-md border bg-background p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label className="text-sm">{editorCopy.status.label}</Label>
            <Select value={publishStatus} onValueChange={value => setPublishStatus(value as 'draft' | 'published')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">{editorCopy.status.options.draft}</SelectItem>
                <SelectItem value="published">{editorCopy.status.options.published}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">{editorCopy.updatedDate}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {new Date().toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date()}
                  onSelect={date => date && updateField('date', date.toISOString().split('T')[0])}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm">{editorCopy.tags.label}</Label>
            <Input
              value={editingItem.tags.join(', ')}
              onChange={e =>
                updateField(
                  'tags',
                  e.target.value
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(Boolean),
                )
              }
              placeholder={editorCopy.tags.placeholder}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-8 rounded-md border bg-background p-6 shadow-sm">
        <div className="space-y-3">
          <Label className="text-base font-medium">{editorCopy.thumbnail.label}</Label>
          <div className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/10 transition-colors hover:bg-muted/20">
            {editingItem.image ? (
              <div className="relative h-full w-full">
                <img
                  src={editingItem.image}
                  alt="thumbnail"
                  className="h-full w-full rounded-lg object-cover"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => updateField('image', '')}
                  className="absolute right-2 top-2"
                >
                  {editorCopy.thumbnail.remove}
                </Button>
              </div>
            ) : (
              <div className="space-y-3 text-center">
                <div className="text-lg font-medium text-foreground">{editorCopy.thumbnail.emptyTitle}</div>
                <div className="text-sm text-muted-foreground">{editorCopy.thumbnail.emptySubtitle}</div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">{editorCopy.language.label}</Label>
          <Tabs value={activeLanguage} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              {(Object.keys(LANGUAGE_META) as Language[]).map(lang => (
                <TabsTrigger key={lang} value={lang} className="flex items-center gap-2">
                  {LANGUAGE_META[lang].tabLabel}
                  {!isRequiredFieldFilled(lang) && (
                    <Badge variant="destructive" className="ml-2">
                      {editorCopy.language.requiredBadge}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {(Object.keys(LANGUAGE_META) as Language[]).map(lang => (
              <TabsContent key={lang} value={lang} className="mt-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor={`title-${lang}`} className="text-base font-medium">
                    {LANGUAGE_META[lang].titleLabel}
                  </Label>
                  <Input
                    id={`title-${lang}`}
                    value={editingItem.title[lang] || ''}
                    onChange={e => updateLocalizedField('title', lang, e.target.value)}
                    placeholder={LANGUAGE_META[lang].titlePlaceholder}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor={`summary-${lang}`} className="text-base font-medium">
                    {LANGUAGE_META[lang].summaryLabel}
                  </Label>
                  <Textarea
                    id={`summary-${lang}`}
                    rows={3}
                    value={editingItem.summary[lang] || ''}
                    placeholder={LANGUAGE_META[lang].summaryPlaceholder}
                    onChange={e => updateLocalizedField('summary', lang, e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor={`body-${lang}`} className="text-base font-medium">
                    {LANGUAGE_META[lang].bodyLabel}
                  </Label>
                  <div className="editor-container">
        <SimpleTemplateEditor
          initialContent={editingItem.body[lang] || ''}
          onContentChange={(docJson) => {
            updateLocalizedField('body', lang, docJson);
          }}
        />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button
            variant="outline"
            onClick={() => { handleSave('draft').catch(() => undefined); }}
            size="lg"
            disabled={isSubmitting}
          >
            {editorCopy.actions.saveDraft}
          </Button>
          <Button
            onClick={() => { handleSave('published').catch(() => undefined); }}
            size="lg"
            className="bg-green-600 text-white hover:bg-green-700"
            disabled={!bothLanguagesFilled() || isSubmitting}
          >
            {editorCopy.actions.publish}
          </Button>
        </div>
      </div>
    </section>

    {showPreview && (
      <aside
        className="sm:w-[420px] sm:flex-shrink-0 sticky"
        style={{ top: '64px', height: 'calc(100dvh - 64px)' }}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-md border bg-background shadow-sm">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-background p-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="font-medium">{previewTitle}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={previewLanguage === 'ja' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handlePreviewLanguageChange('ja')}
                >
                  {previewLanguageToggleLabels.ja}
                </Button>
                <Button
                  variant={previewLanguage === 'en' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handlePreviewLanguageChange('en')}
                >
                  {previewLanguageToggleLabels.en}
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
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                <EyeOff className="w-4 h-4 mr-1" /> {hidePreviewLabel}
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className={cn(
              previewDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full',
              previewTheme === 'dark' && 'dark',
            )}>
              <NewsPreview item={editingItem} language={previewLanguage} theme={previewTheme} />
            </div>
          </div>
        </div>
      </aside>
    )}
  </div>
</main>
    </div>
  );
}
