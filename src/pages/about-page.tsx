import { Download, Calendar, Award, Code, Brain } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Locale } from '../lib/types'
import profileImage from '../assets/37d3f31165fb6b41b77513c4d8e0d1b581053602.png'
import { getTranslations } from '../lib/i18n'

interface AboutPageProps {
  locale: Locale
}

export function AboutPage({ locale }: AboutPageProps) {
  const t = getTranslations(locale)

  const timeline = [
    {
      year: '2024 - Present',
      title: locale === 'ja' ? '博士課程学生' : 'PhD Student',
      organization: locale === 'ja' ? '○○大学 工学研究科' : 'Graduate School of Engineering, XX University',
      description: locale === 'ja' 
        ? '機械学習とコンピュータビジョンの研究に従事'
        : 'Research in machine learning and computer vision'
    },
    {
      year: '2022 - 2024',
      title: locale === 'ja' ? '修士課程' : 'Master\'s Degree',
      organization: locale === 'ja' ? '○○大学 工学研究科' : 'Graduate School of Engineering, XX University',
      description: locale === 'ja'
        ? 'GPA 3.9/4.0、優秀学生賞受賞'
        : 'GPA 3.9/4.0, Outstanding Student Award'
    },
    {
      year: '2018 - 2022',
      title: locale === 'ja' ? '学士課程' : 'Bachelor\'s Degree',
      organization: locale === 'ja' ? '○○大学 工学部' : 'Faculty of Engineering, XX University',
      description: locale === 'ja'
        ? 'コンピュータサイエンス専攻、首席卒業'
        : 'Computer Science Major, Summa Cum Laude'
    }
  ]

  const researchSkills = [
    'Machine Learning',
    'Deep Learning',
    'Computer Vision',
    'Natural Language Processing',
    'Medical Image Analysis',
    'Statistical Analysis'
  ]

  const technicalSkills = [
    'Python',
    'PyTorch',
    'TensorFlow',
    'React',
    'TypeScript',
    'Docker',
    'AWS',
    'GPU Computing'
  ]

  const awards = [
    {
      year: 2024,
      title: locale === 'ja' ? 'MICCAI Best Paper Award' : 'MICCAI Best Paper Award',
      description: locale === 'ja' 
        ? '医療画像解析に関する革新的研究で受賞'
        : 'For innovative research in medical image analysis'
    },
    {
      year: 2024,
      title: locale === 'ja' ? '人工知能学会全国大会 優秀賞' : 'JSAI Outstanding Paper Award',
      description: locale === 'ja'
        ? '自然言語処理の研究で優秀賞を受賞'
        : 'For excellence in natural language processing research'
    },
    {
      year: 2023,
      title: locale === 'ja' ? '学生優秀賞' : 'Outstanding Student Award',
      description: locale === 'ja'
        ? '学業成績と研究業績を評価'
        : 'Recognition for academic and research excellence'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="space-y-16">
        {/* Header */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold">{t.about.title}</h1>
          
          <div className="flex justify-center">
            <img
              src={profileImage}
              alt={t.about.profile.name}
              className="w-32 h-32 rounded-full object-cover border shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{t.about.profile.name}</h2>
            <p className="text-lg text-muted-foreground">{t.about.profile.title}</p>
            <p className="text-muted-foreground">{t.about.profile.affiliation}</p>
          </div>

          <Button asChild>
            <a href="/cv.pdf" target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              {t.home.cta.cv}
            </a>
          </Button>
        </section>

        {/* Biography */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold flex items-center">
            <Brain className="mr-3 h-6 w-6" />
            {t.about.sections.biography}
          </h3>
          
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                {locale === 'ja' 
                  ? '機械学習とコンピュータビジョンを専門とする博士課程学生です。特に医療画像解析と自然言語処理の分野で革新的な研究を行っており、実世界の問題解決に向けた応用研究に情熱を注いでいます。これまでに国際的なトップカンファレンスで10本以上の論文を発表し、複数の賞を受賞しています。研究と並行して、オープンソースプロジェクトへの貢献や技術コミュニティでの活動も積極的に行っています。'
                  : 'I am a PhD student specializing in machine learning and computer vision. I conduct innovative research particularly in medical image analysis and natural language processing, with a passion for applied research toward real-world problem solving. I have published over 10 papers at international top-tier conferences and received multiple awards. Alongside my research, I actively contribute to open-source projects and engage in technical community activities.'
                }
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Timeline */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold flex items-center">
            <Calendar className="mr-3 h-6 w-6" />
            {t.about.sections.timeline}
          </h3>

          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={index} className="flex">
                <div className="flex flex-col items-center mr-6">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  {index < timeline.length - 1 && (
                    <div className="w-px h-20 bg-border mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h4 className="font-semibold">{item.title}</h4>
                    <span className="text-sm text-muted-foreground">{item.year}</span>
                  </div>
                  <p className="text-muted-foreground mb-2">{item.organization}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold flex items-center">
            <Code className="mr-3 h-6 w-6" />
            {t.about.sections.skills}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {locale === 'ja' ? '研究スキル' : 'Research Skills'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {researchSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {locale === 'ja' ? '技術スキル' : 'Technical Skills'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {technicalSkills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Awards */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold flex items-center">
            <Award className="mr-3 h-6 w-6" />
            {t.about.sections.awards}
          </h3>

          <div className="space-y-4">
            {awards.map((award, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-semibold">{award.title}</h4>
                      <p className="text-sm text-muted-foreground">{award.description}</p>
                    </div>
                    <Badge variant="secondary">{award.year}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Research Interests */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold">
            {locale === 'ja' ? '研究分野' : 'Research Interests'}
          </h3>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3">
                    {locale === 'ja' ? '機械学習・深層学習' : 'Machine Learning & Deep Learning'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ja'
                      ? '新たなアーキテクチャの開発、最適化手法の改良、実用的なアプリケーションへの応用'
                      : 'Development of novel architectures, optimization method improvements, practical applications'
                    }
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">
                    {locale === 'ja' ? '医療画像解析' : 'Medical Image Analysis'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ja'
                      ? '画像セグメンテーション、疾患検出、診断支援システムの開発'
                      : 'Image segmentation, disease detection, diagnostic support system development'
                    }
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">
                    {locale === 'ja' ? '自然言語処理' : 'Natural Language Processing'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ja'
                      ? 'テキスト分類、情報抽出、対話システムの研究'
                      : 'Text classification, information extraction, dialogue system research'
                    }
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">
                    {locale === 'ja' ? 'コンピュータビジョン' : 'Computer Vision'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ja'
                      ? '物体検出、画像認識、シーン理解の技術開発'
                      : 'Object detection, image recognition, scene understanding technology development'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
