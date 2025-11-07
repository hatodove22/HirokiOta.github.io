# Aboutページ更新マニュアル

このドキュメントでは、ポートフォリオサイトのAboutページを更新する手順を詳しく説明します。

## 目次

- [⚠️ AI向け重大な注意書き（必須確認事項）](#-ai向け重大な注意書き必須確認事項)
- [用意しておく情報リスト](#用意しておく情報リスト)
- [概要](#概要)
- [更新手順](#更新手順)
- [各手順の詳細](#各手順の詳細)
- [各項目の編集方法](#各項目の編集方法)
- [よくある質問（FAQ）](#よくある質問faq)

---

## ⚠️ AI向け重大な注意書き（必須確認事項）

**この注意書きは、Aboutページ更新作業を行う際に、必ず最初に確認してください。**

**AIは以下のルールを厳守してください：**

### 更新作業開始前の必須確認

1. **必要な情報がすべて揃うまで更新作業を開始しない**
   - 以下の「ユーザーが用意すべき情報リスト」に記載されている情報が**すべて揃うまで**、更新作業を開始してはいけません。
   - 情報が不足している場合は、必ずユーザーに確認を取ってください。

2. **更新作業開始前の確認手順**
   - 更新作業を開始する前に、必ず以下の手順を実行してください：
     1. 以下の「ユーザーが用意すべき情報リスト」を確認
     2. ユーザーが提供した情報と照らし合わせて、不足している情報がないか確認
     3. 不足している情報がある場合は、**更新作業を開始せず**、ユーザーに不足している情報を明確に伝えて確認を取る
     4. **すべての必要な情報が揃ったことを確認できた場合のみ**、更新作業を開始する

3. **確認を取る際の注意点**
   - 不足している情報を箇条書きで明確に提示してください
   - ユーザーが「とりあえず進めて」などと言っても、必要な情報が不足している場合は、更新作業を開始しないでください
   - 情報が不足している場合は、「以下の情報が不足しているため、更新作業を開始できません。不足している情報を提供いただけますか？」という形で確認を取ってください

4. **情報が不足している場合の対応**
   - 情報が不足している場合は、**決して推測や仮の値で更新作業を進めないでください**
   - 情報が不足している場合は、**ファイルの作成・更新を行わないでください**
   - 情報が不足している場合は、**ユーザーに確認を取るまで待機してください**

---

## 用意しておく情報リスト

このポートフォリオは基本的にAIが更新することを前提としています。以下のリストは、ユーザーが用意すべき情報と、AIが適切に設定すべき情報を分けて記載しています。

### ユーザーが用意すべき情報リスト

Aboutページを更新する際に、ユーザーが提供すべき情報です。

#### 基本情報（プロフィール画像・名前・所属）

- [ ] **プロフィール画像**（オプション）
  - 形式: PNG または JPEG
  - 推奨サイズ: 256px × 256px 以上（正方形）
  - ファイルサイズ: 1MB未満
  - 注意: 画像は円形に表示されるため、中央に配置する必要があります

- [ ] **名前**（日本語・英語）
  - 例: 日本語「太田裕紀」、英語「Hiroki Ota」
  - 注意: `src/lib/i18n.ts` の `translations.about.profile.name` を更新

- [ ] **タイトル**（日本語・英語）
  - 例: 日本語「博士課程学生」、英語「PhD Student」
  - 注意: `src/lib/i18n.ts` の `translations.about.profile.title` を更新

- [ ] **所属**（日本語・英語）
  - 例: 日本語「奈良先端科学技術大学院大学　サイバネティクスリアリティ工学研究室」、英語「Nara Institute of Science and Technology, Cybernetics Reality Engineering Laboratory」
  - 注意: `src/lib/i18n.ts` の `translations.about.profile.affiliation` を更新

#### Introduction（自己紹介）

- [ ] **自己紹介文**（日本語・英語）
  - 例: 日本語「私は奈良先端科学技術大学院大学（NAIST）の博士課程学生です。...」、英語「I am a Ph.D. student at the Nara Institute of Science and Technology (NAIST). ...」
  - 注意: `src/pages/about-page.tsx` の `Introduction` セクション内のテキストを更新

#### Timeline（プロフィール・経歴）

- [ ] **経歴項目**（各項目について）
  - 年: 例 `"2024 - Present"` または `"2022 - 2024"`
  - タイトル（日本語・英語）: 例 日本語「博士課程学生」、英語「PhD Student」
  - 所属（日本語・英語）: 例 日本語「奈良先端科学技術大学院大学（NAIST）」、英語「Nara Institute of Science and Technology (NAIST)」
  - 説明（日本語・英語）: 例 日本語「触覚技術、ロボティクス、バーチャルリアリティの研究に従事」、英語「Research in haptic technology, robotics, and virtual reality」
  - 注意: `src/pages/about-page.tsx` の `timeline` 配列を更新

#### Research Skills（研究スキル）

- [ ] **研究スキルリスト**（英語のみ）
  - 例: `["Haptic Technology", "Robotics", "Virtual Reality", ...]`
  - 注意: `src/pages/about-page.tsx` の `researchSkills` 配列を更新

#### Technical Skills（技術スキル）

- [ ] **技術スキルリスト**（英語のみ）
  - 例: `["C++", "Python", "Unity", ...]`
  - 注意: `src/pages/about-page.tsx` の `technicalSkills` 配列を更新

#### Interests（主な興味関心）

- [ ] **興味関心項目**（各項目について）
  - タイトル（日本語・英語）: 例 日本語「触覚技術・ハプティクス」、英語「Haptic Technology & Haptics」
  - 説明（日本語・英語）: 例 日本語「FresnelShapeをはじめとする新しい触覚デバイスの開発と...」、英語「Developing novel haptic devices like FresnelShape and...」
  - 注意: `src/pages/about-page.tsx` の `Interests` セクション内のテキストを更新

#### Goals（これからの目標）

- [ ] **目標項目**（各項目について）
  - タイトル（日本語・英語）: 例 日本語「深部感覚に基づく形状・剛性・重量提示の確立」、英語「Establish depth-sensation-based shape/rigidity/weight rendering」
  - 説明（日本語・英語）: 例 日本語「指先接平面の傾き操作を核とした提示設計を洗練し...」、英語「Refine fingertip contact tilt manipulation to...」
  - 注意: `src/pages/about-page.tsx` の `goals` 配列を更新

#### Extracurricular Activities（課外活動）

- [ ] **課外活動リスト**（日本語・英語）
  - 例: 日本語「缶サット甲子園 全国大会準優勝（通算2回）」、英語「Cansat Koshien: National runner-up (twice)」
  - 注意: `src/pages/about-page.tsx` の `Extracurriculars` セクション内のリストを更新

#### Funding（獲得資金）

- [ ] **獲得資金リスト**（日本語・英語）
  - 例: 日本語「関西テッククリエイターチャレンジ：165万円」、英語「Kansai Tech Creator Challenge: 1.65M JPY」
  - 注意: `src/pages/about-page.tsx` の `Funding` セクション内のリストを更新

#### Academic Contributions（学術貢献）

- [ ] **学術貢献リスト**（日本語・英語）
  - 例: 日本語「触覚若手の会 疑似査読者会議・デモ交流会（ベスプレ）」、英語「Young Haptics community: mock reviewer meeting; demo exchange (Best Presentation)」
  - 注意: `src/pages/about-page.tsx` の `Academic Contributions` セクション内のリストを更新

---

### AIが適切に設定すべき情報リスト

以下の情報は、AIがユーザーが提供した情報を基に自動的に生成・設定します。

#### 多言語対応の設定

- [ ] **i18n辞書の更新**
  - `src/lib/i18n.ts` の `translations.about` オブジェクトを更新
  - 日本語（`ja`）と英語（`en`）の両方を設定

#### コード内の直接編集

- [ ] **`src/pages/about-page.tsx` の更新**
  - 各セクションの配列やテキストを直接編集
  - 多言語対応の条件分岐（`locale === 'ja' ? ... : ...`）を適切に設定

#### 画像ファイルの配置

- [ ] **プロフィール画像の配置**
  - 画像ファイルを `src/assets/` ディレクトリに配置
  - `src/pages/about-page.tsx` の `import` 文を更新
  - 例: `import profileImage from '../assets/37d3f31165fb6b41b77513c4d8e0d1b581053602.png'`

---

## 概要

Aboutページは `src/pages/about-page.tsx` で定義されています。このファイルは、静的な配列や条件分岐を使用して多言語対応のコンテンツを表示します。

主な構造：
- **プロフィール情報**: `src/lib/i18n.ts` の `translations.about.profile` から取得
- **Introduction**: `src/pages/about-page.tsx` 内に直接記述
- **Timeline**: `src/pages/about-page.tsx` の `timeline` 配列
- **Skills**: `src/pages/about-page.tsx` の `researchSkills` と `technicalSkills` 配列
- **Interests**: `src/pages/about-page.tsx` 内に直接記述
- **Goals**: `src/pages/about-page.tsx` の `goals` 配列
- **Extracurricular Activities**: `src/pages/about-page.tsx` 内に直接記述
- **Funding**: `src/pages/about-page.tsx` 内に直接記述
- **Academic Contributions**: `src/pages/about-page.tsx` 内に直接記述

---

## 更新手順

Aboutページを更新する際の基本的な手順は以下の通りです：

1. **ユーザーから情報を確認**
   - 更新対象の項目を確認
   - 必要な情報がすべて揃っているか確認

2. **対応するファイルを編集**
   - プロフィール情報（名前・タイトル・所属）: `src/lib/i18n.ts` を編集
   - その他の項目: `src/pages/about-page.tsx` を編集

3. **画像の更新（必要な場合）**
   - プロフィール画像を `src/assets/` に配置
   - `src/pages/about-page.tsx` の `import` 文を更新

4. **表示確認**
   - 開発サーバーで変更内容を確認
   - 日本語と英語の両方の言語で確認

---

## 各手順の詳細

### 1. プロフィール情報の更新（名前・タイトル・所属）

#### ファイルの場所
```
src/lib/i18n.ts
```

#### 更新手順

1. **`src/lib/i18n.ts` を開く**

2. **`translations.about.profile` オブジェクトを更新**

3. **日本語（`ja`）と英語（`en`）の両方を更新**

#### 各項目の説明

| 項目 | 説明 | 必須 | 例 |
|------|------|------|-----|
| `name` | 名前 | ✅ | `"太田裕紀"`（日本語）、`"Hiroki Ota"`（英語） |
| `title` | タイトル | ✅ | `"博士課程学生"`（日本語）、`"PhD Student"`（英語） |
| `affiliation` | 所属 | ✅ | `"奈良先端科学技術大学院大学　サイバネティクスリアリティ工学研究室"`（日本語）、`"Nara Institute of Science and Technology, Cybernetics Reality Engineering Laboratory"`（英語） |

#### 例：プロフィール情報の更新

```typescript
about: {
  title: 'About Me',
  profile: {
    name: '太田裕紀',  // 日本語版
    title: '博士課程学生',  // 日本語版
    affiliation: '奈良先端科学技術大学院大学　サイバネティクスリアリティ工学研究室'  // 日本語版
  },
  // ... 他のセクション
}
```

```typescript
about: {
  title: 'About Me',
  profile: {
    name: 'Hiroki Ota',  // 英語版
    title: 'PhD Student',  // 英語版
    affiliation: 'Nara Institute of Science and Technology, Cybernetics Reality Engineering Laboratory'  // 英語版
  },
  // ... 他のセクション
}
```

---

### 2. プロフィール画像の更新

#### ファイルの場所
```
src/assets/{画像ファイル名}.png
src/pages/about-page.tsx（import文）
```

#### 更新手順

1. **新しいプロフィール画像を準備**
   - 形式: PNG または JPEG
   - 推奨サイズ: 256px × 256px 以上（正方形）
   - ファイルサイズ: 1MB未満

2. **画像ファイルを `src/assets/` ディレクトリに配置**
   - 例: `src/assets/profile-image.png`

3. **`src/pages/about-page.tsx` の `import` 文を更新**
   ```typescript
   import profileImage from '../assets/profile-image.png'
   ```

4. **既存の画像ファイルを削除（オプション）**
   - 古い画像ファイルが不要になった場合は削除

#### 重要な注意点

- **画像は円形に表示される**: CSSで `rounded-full` クラスが適用されるため、中央に配置する必要があります
- **画像パスの更新**: `import` 文を更新する際は、相対パスが正しいことを確認してください
- **ファイル名**: ファイル名は英数字とハイフン、アンダースコアのみを使用してください

---

### 3. Introduction（自己紹介）の更新

#### ファイルの場所
```
src/pages/about-page.tsx
```

#### 更新箇所

`src/pages/about-page.tsx` の `Introduction` セクション内のテキストを直接編集します。

#### 更新手順

1. **`src/pages/about-page.tsx` を開く**

2. **`Introduction` セクションを探す**（約140行目付近）

3. **条件分岐内のテキストを更新**
   ```typescript
   {locale === 'ja' 
     ? '日本語の自己紹介文'
     : 'English introduction text'
   }
   ```

#### 例：Introductionの更新

```typescript
<CardContent className="p-6">
  <p className="text-body leading-relaxed">
    {locale === 'ja' 
      ? '私は奈良先端科学技術大学院大学（NAIST）の博士課程学生です。触覚技術、ロボティクス、バーチャルリアリティの研究に従事しています。特に、人間の触覚的形状認知特性に着目したハンドヘルド型形状提示装置「FresnelShape」の開発と評価を行っています。VR環境における触覚体験の向上を目指しています。'
      : 'I am a Ph.D. student at the Nara Institute of Science and Technology (NAIST). I am engaged in research on haptic technology, robotics, and virtual reality. Specifically, I am developing and evaluating "FresnelShape," a handheld shape display device focusing on human tactile shape perception characteristics. I aim to enhance tactile experiences in VR environments.'
    }
  </p>
</CardContent>
```

---

## 各項目の編集方法

### 1. Timeline（プロフィール・経歴）の編集

#### ファイルの場所
```
src/pages/about-page.tsx
```

#### 更新箇所

`src/pages/about-page.tsx` の `timeline` 配列を編集します（約16行目付近）。

#### データ構造

```typescript
const timeline = [
  {
    year: '2024 - Present',
    title: locale === 'ja' ? '博士課程学生' : 'PhD Student',
    organization: locale === 'ja' ? '奈良先端科学技術大学院大学（NAIST）' : 'Nara Institute of Science and Technology (NAIST)',
    description: locale === 'ja' 
      ? '触覚技術、ロボティクス、バーチャルリアリティの研究に従事'
      : 'Research in haptic technology, robotics, and virtual reality'
  },
  // ... 他の項目
]
```

#### 各項目の説明

| 項目 | 説明 | 必須 | 例 |
|------|------|------|-----|
| `year` | 期間 | ✅ | `"2024 - Present"` または `"2022 - 2024"` |
| `title` | タイトル（日本語・英語） | ✅ | 日本語「博士課程学生」、英語「PhD Student」 |
| `organization` | 所属（日本語・英語） | ✅ | 日本語「奈良先端科学技術大学院大学（NAIST）」、英語「Nara Institute of Science and Technology (NAIST)」 |
| `description` | 説明（日本語・英語） | ✅ | 日本語「触覚技術、ロボティクス、バーチャルリアリティの研究に従事」、英語「Research in haptic technology, robotics, and virtual reality」 |

#### 追加方法

1. **`timeline` 配列に新しいオブジェクトを追加**
   ```typescript
   {
     year: '2020 - 2022',
     title: locale === 'ja' ? '学士課程' : 'Bachelor\'s Degree',
     organization: locale === 'ja' ? '東京理科大学' : 'Tokyo University of Science',
     description: locale === 'ja' 
       ? '機械工学専攻'
       : 'Mechanical Engineering Major'
   }
   ```

2. **配列の先頭に追加**（最新の項目を上に表示するため）
   - 注意: ページ上では `timeline.slice().reverse()` で表示順序が逆転されるため、最新の項目を配列の末尾に追加してください

#### 編集方法

1. **既存項目を編集**
   - `timeline` 配列内の該当オブジェクトを直接編集

2. **項目を削除**
   - `timeline` 配列から該当オブジェクトを削除

#### 重要な注意点

- **表示順序**: ページ上では `timeline.slice().reverse()` で表示順序が逆転されるため、最新の項目を配列の末尾に追加してください
- **多言語対応**: 各項目の `title`、`organization`、`description` は `locale === 'ja' ? ... : ...` の条件分岐を使用して多言語対応してください

---

### 2. Research Skills（研究スキル）の編集

#### ファイルの場所
```
src/pages/about-page.tsx
```

#### 更新箇所

`src/pages/about-page.tsx` の `researchSkills` 配列を編集します（約43行目付近）。

#### データ構造

```typescript
const researchSkills = [
  'Haptic Technology',
  'Robotics',
  'Virtual Reality',
  'Human-Computer Interaction',
  'Tactile Perception',
  'Shape Display Devices'
]
```

#### 追加方法

1. **`researchSkills` 配列に新しい文字列を追加**
   ```typescript
   'New Skill'
   ```

#### 編集方法

1. **既存スキルを編集**
   - `researchSkills` 配列内の該当文字列を直接編集

2. **スキルを削除**
   - `researchSkills` 配列から該当文字列を削除

#### 重要な注意点

- **英語のみ**: 研究スキルは英語のみで記述してください（日本語は表示されません）
- **大文字・小文字**: 各スキルは適切な大文字・小文字を使用してください（例: `"Haptic Technology"` ではなく `"Haptic Technology"`）

---

### 3. Technical Skills（技術スキル）の編集

#### ファイルの場所
```
src/pages/about-page.tsx
```

#### 更新箇所

`src/pages/about-page.tsx` の `technicalSkills` 配列を編集します（約52行目付近）。

#### データ構造

```typescript
const technicalSkills = [
  'C++',
  'Python',
  'Unity',
  'OpenGL',
  'Arduino',
  'ROS',
  '3D Modeling',
  'Electronics'
]
```

#### 追加方法

1. **`technicalSkills` 配列に新しい文字列を追加**
   ```typescript
   'New Skill'
   ```

#### 編集方法

1. **既存スキルを編集**
   - `technicalSkills` 配列内の該当文字列を直接編集

2. **スキルを削除**
   - `technicalSkills` 配列から該当文字列を削除

#### 重要な注意点

- **英語のみ**: 技術スキルは英語のみで記述してください（日本語は表示されません）
- **大文字・小文字**: 各スキルは適切な大文字・小文字を使用してください（例: `"Python"` ではなく `"Python"`）

---

### 4. Interests（主な興味関心）の編集

#### ファイルの場所
```
src/pages/about-page.tsx
```

#### 更新箇所

`src/pages/about-page.tsx` の `Interests` セクション内のテキストを直接編集します（約224行目付近）。

#### データ構造

このセクションは配列ではなく、JSX内に直接記述されています。各興味関心項目は以下の構造を持ちます：

```typescript
<div>
  <h4 className="mb-3 font-semibold">
    {locale === 'ja' ? '触覚技術・ハプティクス' : 'Haptic Technology & Haptics'}
  </h4>
  <p className="text-sm text-muted-foreground">
    {locale === 'ja'
      ? 'FresnelShapeをはじめとする新しい触覚デバイスの開発と、人間の触覚認知特性の研究を行っています。'
      : 'Developing novel haptic devices like FresnelShape and researching human tactile perception characteristics.'
    }
  </p>
</div>
```

#### 追加方法

1. **`Interests` セクション内に新しい `<div>` 要素を追加**
   ```typescript
   <div>
     <h4 className="mb-3 font-semibold">
       {locale === 'ja' ? '新しい興味関心' : 'New Interest'}
     </h4>
     <p className="text-sm text-muted-foreground">
       {locale === 'ja'
         ? '説明文（日本語）'
         : 'Description (English)'
       }
     </p>
   </div>
   ```

#### 編集方法

1. **既存項目を編集**
   - `Interests` セクション内の該当 `<div>` 要素を直接編集

2. **項目を削除**
   - `Interests` セクション内の該当 `<div>` 要素を削除

#### 重要な注意点

- **多言語対応**: 各項目の `title` と `description` は `locale === 'ja' ? ... : ...` の条件分岐を使用して多言語対応してください
- **レイアウト**: このセクションは `grid grid-cols-1 gap-8 md:grid-cols-2` で表示されるため、2列のグリッドレイアウトになります

---

### 5. Goals（これからの目標）の編集

#### ファイルの場所
```
src/pages/about-page.tsx
```

#### 更新箇所

`src/pages/about-page.tsx` の `goals` 配列を編集します（約63行目付近）。

#### データ構造

```typescript
const goals = [
  {
    title: locale === 'ja' ? '深部感覚に基づく形状・剛性・重量提示の確立' : 'Establish depth-sensation-based shape/rigidity/weight rendering',
    description: locale === 'ja'
      ? '指先接平面の傾き操作を核とした提示設計を洗練し、形状・剛性・重量といった深部感覚プロパティを単一デバイスで高効率に提示できる方式を確立します。'
      : 'Refine fingertip contact tilt manipulation to efficiently render shape, rigidity, and weight with a single handheld device leveraging depth sensation.'
  },
  // ... 他の項目
]
```

#### 各項目の説明

| 項目 | 説明 | 必須 | 例 |
|------|------|------|-----|
| `title` | タイトル（日本語・英語） | ✅ | 日本語「深部感覚に基づく形状・剛性・重量提示の確立」、英語「Establish depth-sensation-based shape/rigidity/weight rendering」 |
| `description` | 説明（日本語・英語） | ✅ | 日本語「指先接平面の傾き操作を核とした提示設計を洗練し...」、英語「Refine fingertip contact tilt manipulation to...」 |

#### 追加方法

1. **`goals` 配列に新しいオブジェクトを追加**
   ```typescript
   {
     title: locale === 'ja' ? '新しい目標' : 'New Goal',
     description: locale === 'ja'
       ? '説明文（日本語）'
       : 'Description (English)'
   }
   ```

#### 編集方法

1. **既存項目を編集**
   - `goals` 配列内の該当オブジェクトを直接編集

2. **項目を削除**
   - `goals` 配列から該当オブジェクトを削除

#### 重要な注意点

- **多言語対応**: 各項目の `title` と `description` は `locale === 'ja' ? ... : ...` の条件分岐を使用して多言語対応してください
- **レイアウト**: このセクションは `grid grid-cols-1 gap-4 md:grid-cols-2` で表示されるため、2列のグリッドレイアウトになります

---

### 6. Extracurricular Activities（課外活動）の編集

#### ファイルの場所
```
src/pages/about-page.tsx
```

#### 更新箇所

`src/pages/about-page.tsx` の `Extracurriculars` セクション内のリストを直接編集します（約310行目付近）。

#### データ構造

このセクションは配列ではなく、JSX内に直接記述されています。リスト項目は以下の構造を持ちます：

```typescript
<ul className="list-disc pl-6 space-y-1">
  <li>{locale === 'ja' ? '缶サット甲子園 全国大会準優勝（通算2回）' : 'Cansat Koshien: National runner-up (twice)'}</li>
  <li>{locale === 'ja' ? 'Google Science Jam 2015 JAXA審査員賞' : 'Google Science Jam 2015: JAXA Jury Prize'}</li>
  // ... 他の項目
</ul>
```

#### 追加方法

1. **`Extracurriculars` セクション内の `<ul>` 要素に新しい `<li>` 要素を追加**
   ```typescript
   <li>{locale === 'ja' ? '新しい課外活動（日本語）' : 'New Extracurricular Activity (English)'}</li>
   ```

#### 編集方法

1. **既存項目を編集**
   - `Extracurriculars` セクション内の該当 `<li>` 要素を直接編集

2. **項目を削除**
   - `Extracurriculars` セクション内の該当 `<li>` 要素を削除

#### 重要な注意点

- **多言語対応**: 各項目は `locale === 'ja' ? ... : ...` の条件分岐を使用して多言語対応してください
- **表示順序**: リスト項目は上から下に表示されます

---

### 7. Funding（獲得資金）の編集

#### ファイルの場所
```
src/pages/about-page.tsx
```

#### 更新箇所

`src/pages/about-page.tsx` の `Funding` セクション内のリストを直接編集します（約326行目付近）。

#### データ構造

このセクションは配列ではなく、JSX内に直接記述されています。リスト項目は以下の構造を持ちます：

```typescript
<ul className="list-disc pl-6 space-y-1">
  <li>{locale === 'ja' ? '関西テッククリエイターチャレンジ：165万円' : 'Kansai Tech Creator Challenge: 1.65M JPY'}</li>
  <li>{locale === 'ja' ? 'JASSO 海外留学支援制度（協定派遣）：66万円' : 'JASSO Study Abroad Support (Exchange): 0.66M JPY'}</li>
  // ... 他の項目
</ul>
```

#### 追加方法

1. **`Funding` セクション内の `<ul>` 要素に新しい `<li>` 要素を追加**
   ```typescript
   <li>{locale === 'ja' ? '新しい獲得資金（日本語）' : 'New Funding (English)'}</li>
   ```

#### 編集方法

1. **既存項目を編集**
   - `Funding` セクション内の該当 `<li>` 要素を直接編集

2. **項目を削除**
   - `Funding` セクション内の該当 `<li>` 要素を削除

#### 重要な注意点

- **多言語対応**: 各項目は `locale === 'ja' ? ... : ...` の条件分岐を使用して多言語対応してください
- **表示順序**: リスト項目は上から下に表示されます

---

### 8. Academic Contributions（学術貢献）の編集

#### ファイルの場所
```
src/pages/about-page.tsx
```

#### 更新箇所

`src/pages/about-page.tsx` の `Academic Contributions` セクション内のリストを直接編集します（約346行目付近）。

#### データ構造

このセクションは配列ではなく、JSX内に直接記述されています。リスト項目は以下の構造を持ちます：

```typescript
<ul className="list-disc pl-6 space-y-1">
  <li>{locale === 'ja' ? '触覚若手の会 疑似査読者会議・デモ交流会（ベスプレ）' : 'Young Haptics community: mock reviewer meeting; demo exchange (Best Presentation)'}</li>
  <li>{locale === 'ja' ? '触覚講習会 2024（デモ展示）' : 'Haptics Tutorial 2024 (demo exhibit)'}</li>
  // ... 他の項目
</ul>
```

#### 追加方法

1. **`Academic Contributions` セクション内の `<ul>` 要素に新しい `<li>` 要素を追加**
   ```typescript
   <li>{locale === 'ja' ? '新しい学術貢献（日本語）' : 'New Academic Contribution (English)'}</li>
   ```

#### 編集方法

1. **既存項目を編集**
   - `Academic Contributions` セクション内の該当 `<li>` 要素を直接編集

2. **項目を削除**
   - `Academic Contributions` セクション内の該当 `<li>` 要素を削除

#### 重要な注意点

- **多言語対応**: 各項目は `locale === 'ja' ? ... : ...` の条件分岐を使用して多言語対応してください
- **表示順序**: リスト項目は上から下に表示されます

---

## よくある質問（FAQ）

### Q1: プロフィール画像を変更するには？

A: 以下の手順を実行してください：
1. 新しい画像ファイルを `src/assets/` ディレクトリに配置
2. `src/pages/about-page.tsx` の `import` 文を更新
3. 既存の画像ファイルを削除（オプション）

詳細は「[2. プロフィール画像の更新](#2-プロフィール画像の更新)」を参照してください。

### Q2: Timelineの項目を追加するには？

A: `src/pages/about-page.tsx` の `timeline` 配列に新しいオブジェクトを追加してください。注意: ページ上では `timeline.slice().reverse()` で表示順序が逆転されるため、最新の項目を配列の末尾に追加してください。

詳細は「[1. Timeline（プロフィール・経歴）の編集](#1-timelineプロフィール経歴の編集)」を参照してください。

### Q3: 研究スキルや技術スキルを追加するには？

A: `src/pages/about-page.tsx` の `researchSkills` または `technicalSkills` 配列に新しい文字列を追加してください。注意: スキルは英語のみで記述してください。

詳細は「[2. Research Skills（研究スキル）の編集](#2-research-skills研究スキルの編集)」と「[3. Technical Skills（技術スキル）の編集](#3-technical-skills技術スキルの編集)」を参照してください。

### Q4: 多言語対応はどうすればいい？

A: 各項目で `locale === 'ja' ? ... : ...` の条件分岐を使用して、日本語と英語の両方を設定してください。プロフィール情報（名前・タイトル・所属）は `src/lib/i18n.ts` で管理されています。

### Q5: 更新後に表示を確認するには？

A: 以下の手順を実行してください：
1. 開発サーバーを起動（`npm run dev`）
2. ブラウザで `http://localhost:3000/about` にアクセス
3. 日本語と英語の両方の言語で確認
4. 必要に応じてビルド（`npm run build`）を実行して最終確認

---

## チェックリスト

更新作業を開始する前に、以下を確認してください：

### ユーザー側の確認事項

- [ ] 更新対象の項目が明確か
- [ ] 必要な情報（日本語・英語）がすべて揃っているか
- [ ] プロフィール画像が最適化されているか（ファイルサイズ、解像度）

### AI側の確認事項

- [ ] プロフィール情報（名前・タイトル・所属）が `src/lib/i18n.ts` で正しく更新されているか
- [ ] 各項目の多言語対応が正しく設定されているか（`locale === 'ja' ? ... : ...`）
- [ ] プロフィール画像の `import` 文が正しく更新されているか
- [ ] Timelineの表示順序が正しいか（最新の項目が配列の末尾にあるか）
- [ ] 研究スキル・技術スキルが英語で記述されているか
- [ ] すべてのセクションが正しく表示されるか（日本語・英語両方で確認）

---

## まとめ

Aboutページの更新は、主に `src/pages/about-page.tsx` と `src/lib/i18n.ts` の2つのファイルを編集することで行います。各項目の編集方法は上記の「各項目の編集方法」セクションを参照してください。

更新後は、必ず開発サーバーで日本語と英語の両方の言語で表示を確認してください。
