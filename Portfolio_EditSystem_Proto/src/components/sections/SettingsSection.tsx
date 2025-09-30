import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Save, AlertCircle } from 'lucide-react';

export function SettingsSection() {
  const [settings, setSettings] = useState({
    // Image Settings
    imageMaxSize: 5, // MB
    imageMinResolution: 800, // px
    imageAutoOptimize: true,
    
    // Publishing Settings
    requireReview: false,
    
    // Language Settings
    enforceLanguageConsistency: true,
    
    // Repository Settings
    githubRepo: 'username/portfolio',
    mainBranch: 'main',
    previewBranch: 'preview'
  });

  const updateSetting = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // TODO: Implement settings save
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">設定</h1>
            <p className="text-muted-foreground">システムの動作を設定します</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            設定を保存
          </Button>
        </div>

        <div className="space-y-6">
          {/* Image Settings */}
          <Card>
            <div className="flex items-start justify-between p-6 pb-4">
              <div>
                <h3 className="text-lg font-semibold">画像設定</h3>
              </div>
              <div className="text-right text-sm text-muted-foreground max-w-xs">
                <p>アップロードされる画像の品質とアクセシビリティを管理します</p>
              </div>
            </div>
            <CardContent className="space-y-4 pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="imageMaxSize">最大ファイルサイズ (MB)</Label>
                  <Input
                    id="imageMaxSize"
                    type="number"
                    value={settings.imageMaxSize}
                    onChange={(e) => updateSetting('imageMaxSize', parseInt(e.target.value))}
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <Label htmlFor="imageMinResolution">最小解像度 (px)</Label>
                  <Input
                    id="imageMinResolution"
                    type="number"
                    value={settings.imageMinResolution}
                    onChange={(e) => updateSetting('imageMinResolution', parseInt(e.target.value))}
                    min="400"
                    max="2000"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>自動画像最適化</Label>
                    <p className="text-sm text-muted-foreground">
                      WebP形式への変換とリサイズを自動実行
                    </p>
                  </div>
                  <Switch
                    checked={settings.imageAutoOptimize}
                    onCheckedChange={(checked) => updateSetting('imageAutoOptimize', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Settings */}
          <Card>
            <div className="flex items-start justify-between p-6 pb-4">
              <div>
                <h3 className="text-lg font-semibold">公開設定</h3>
              </div>
              <div className="text-right text-sm text-muted-foreground max-w-xs">
                <p>コンテンツの公開プロセスを設定します</p>
              </div>
            </div>
            <CardContent className="space-y-4 pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <Label>レビュー必須</Label>
                  <p className="text-sm text-muted-foreground">
                    公開前にレビュープロセスを必須とする
                  </p>
                </div>
                <Switch
                  checked={settings.requireReview}
                  onCheckedChange={(checked) => updateSetting('requireReview', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <div className="flex items-start justify-between p-6 pb-4">
              <div>
                <h3 className="text-lg font-semibold">言語設定</h3>
              </div>
              <div className="text-right text-sm text-muted-foreground max-w-xs">
                <p>多言語コンテンツの管理方法を設定します</p>
              </div>
            </div>
            <CardContent className="space-y-4 pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <Label>言語一貫性の強制</Label>
                  <p className="text-sm text-muted-foreground">
                    公開言語に対応するコンテンツの入力を必須とする
                  </p>
                </div>
                <Switch
                  checked={settings.enforceLanguageConsistency}
                  onCheckedChange={(checked) => updateSetting('enforceLanguageConsistency', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Repository Settings */}
          <Card>
            <div className="flex items-start justify-between p-6 pb-4">
              <div>
                <h3 className="text-lg font-semibold">リポジトリ設定</h3>
              </div>
              <div className="text-right text-sm text-muted-foreground max-w-xs">
                <p>GitHub連携とデプロイメントを設定します</p>
              </div>
            </div>
            <CardContent className="space-y-4 pt-0">
              <div>
                <Label htmlFor="githubRepo">GitHubリポジトリ</Label>
                <Input
                  id="githubRepo"
                  value={settings.githubRepo}
                  onChange={(e) => updateSetting('githubRepo', e.target.value)}
                  placeholder="username/repository"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mainBranch">メインブランチ</Label>
                  <Input
                    id="mainBranch"
                    value={settings.mainBranch}
                    onChange={(e) => updateSetting('mainBranch', e.target.value)}
                    placeholder="main"
                  />
                </div>
                <div>
                  <Label htmlFor="previewBranch">プレビューブランチ</Label>
                  <Input
                    id="previewBranch"
                    value={settings.previewBranch}
                    onChange={(e) => updateSetting('previewBranch', e.target.value)}
                    placeholder="preview"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">GitHub Pages連携</p>
                  <p className="text-muted-foreground">
                    変更は自動的にGitHubにプッシュされ、GitHub Pagesでホストされます
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <div className="flex items-start justify-between p-6 pb-4">
              <div>
                <h3 className="text-lg font-semibold">現在のステータス</h3>
              </div>
              <div className="text-right text-sm text-muted-foreground max-w-xs">
                <p>システムの動作状況を確認できます</p>
              </div>
            </div>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">システム状態</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">正常稼働</Badge>
                    <span className="text-sm text-muted-foreground">全機能が利用可能</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">最終同期</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">2分前</Badge>
                    <span className="text-sm text-muted-foreground">GitHub連携</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}