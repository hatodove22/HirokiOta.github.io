import { Download, Calendar, Award, Code, Brain, Compass, Target } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
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

  const goals = [
    {
      title: locale === 'ja' ? '医療AIの社会実装を加速する' : 'Accelerate the clinical adoption of medical AI',
      description: locale === 'ja'
        ? '医療現場のニーズを踏まえ、診断支援や治療計画に直結するAIシステムの共同開発を推進します。'
        : 'Advance collaborative development of AI systems that directly support diagnosis and treatment planning in clinical settings.'
    },
    {
      title: locale === 'ja' ? '国際共同研究をリードする' : 'Lead impactful international collaborations',
      description: locale === 'ja'
        ? '海外研究機関との長期的な連携を構築し、医療AIの国際基準策定と社会実装を加速させます。'
        : 'Build long-term partnerships with global institutes to shape standards and accelerate worldwide deployment of medical AI.'
    },
    {
      title: locale === 'ja' ? '次世代研究者の育成に貢献する' : 'Empower the next generation of researchers',
      description: locale === 'ja'
        ? '教育・コミュニティ活動を通じて、研究倫理と実践力を兼ね備えた若手人材の育成に取り組みます。'
        : 'Invest in mentoring and community work to foster young talents with both research ethics and practical skills.'
    }
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

        {/* Introduction */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold flex items-center">
            <Brain className="mr-3 h-6 w-6" />
            {t.about.sections.introduction}
          </h3>
          
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                {locale === 'ja' 
                  ? '機械学習とコンピュータビジョンを専門とする博士課程学生です。特に医療画像解析と自然言語処理の領域で革新的な研究を行っており、実世界の課題解決に向けた応用研究に情熱を注いでいます。これまでに国際的なトップカンファレンスで10本以上の論文を発表し、複数の賞を受賞してきました。研究と並行して、オープンソースプロジェクトへの貢献や技術コミュニティでの活動も積極的に行っています。'
                  : 'I am a PhD student specializing in machine learning and computer vision. I conduct innovative research particularly in medical image analysis and natural language processing, with a passion for applied research toward real-world problem solving. I have published over 10 papers at international top-tier conferences and received multiple awards. Alongside my research, I actively contribute to open-source projects and engage in technical community activities.'
                }
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Profile */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold flex items-center">
            <Calendar className="mr-3 h-6 w-6" />
            {t.about.sections.profile}
          </h3>

          <div className="space-y-6">
            {timeline.slice().reverse().map((item, index) => (
              <div key={index} className="flex">
                <div className="mr-6 flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  {index < timeline.length - 1 && (
                    <div className="mt-2 h-20 w-px bg-border"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-semibold">{item.title}</h4>
                    <span className="text-sm text-muted-foreground">{item.year}</span>
                  </div>
                  <p className="mb-2 text-muted-foreground">{item.organization}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold flex items-center">
            <Code className="mr-3 h-6 w-6" />
            {t.about.sections.capabilities}
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

        {/* Interests */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold flex items-center">
            <Compass className="mr-3 h-6 w-6" />
            {t.about.sections.interests}
          </h3>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 font-semibold">
                    {locale === 'ja' ? '機械学習・深層学習' : 'Machine Learning & Deep Learning'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ja'
                      ? '新たなアーキテクチャや最適化手法の設計、医療・産業領域への応用を探求しています。'
                      : 'Designing novel architectures, refining optimization methods, and exploring applications in healthcare and industry.'
                    }
                  </p>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">
                    {locale === 'ja' ? '医療画像解析' : 'Medical Image Analysis'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ja'
                      ? '画像診断支援のためのセグメンテーション、疾患検出、ベンチマーク構築に注力しています。'
                      : 'Focusing on segmentation, disease detection, and benchmark creation for computer-aided diagnosis.'
                    }
                  </p>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">
                    {locale === 'ja' ? '自然言語処理' : 'Natural Language Processing'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ja'
                      ? '医療記録や学術情報を対象にした情報抽出、質疑応答、会話システムを研究しています。'
                      : 'Researching information extraction, question answering, and dialogue systems for medical and scholarly text.'
                    }
                  </p>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">
                    {locale === 'ja' ? 'コンピュータビジョン' : 'Computer Vision'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ja'
                      ? '物体検出やシーン理解など、現場で機能するロバストな視覚認識技術を追求しています。'
                      : 'Advancing robust visual recognition technologies for object detection and scene understanding in the real world.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Goals */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold flex items-center">
            <Target className="mr-3 h-6 w-6" />
            {t.about.sections.goals}
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {goals.map((goal) => (
              <Card key={goal.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </CardContent>
              </Card>
            ))}
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
                    <div className="flex-1 space-y-1">
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

      </div>
    </div>
  )
}

