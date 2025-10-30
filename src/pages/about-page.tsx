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
      organization: locale === 'ja' ? '奈良先端科学技術大学院大学（NAIST）' : 'Nara Institute of Science and Technology (NAIST)',
      description: locale === 'ja' 
        ? '触覚技術、ロボティクス、バーチャルリアリティの研究に従事'
        : 'Research in haptic technology, robotics, and virtual reality'
    },
    {
      year: '2022 - 2024',
      title: locale === 'ja' ? '修士課程' : 'Master\'s Degree',
      organization: locale === 'ja' ? '奈良先端科学技術大学院大学（NAIST）' : 'Nara Institute of Science and Technology (NAIST)',
      description: locale === 'ja'
        ? '情報科学専攻、触覚インターフェース研究'
        : 'Information Science Major, Haptic Interface Research'
    },
    {
      year: '2018 - 2022',
      title: locale === 'ja' ? '学士課程' : 'Bachelor\'s Degree',
      organization: locale === 'ja' ? '東京理科大学 理工学部 機械工学科' : 'Tokyo University of Science, Faculty of Science and Technology, Department of Mechanical Engineering',
      description: locale === 'ja'
        ? '機械工学専攻'
        : 'Mechanical Engineering Major'
    }
  ]

  const researchSkills = [
    'Haptic Technology',
    'Robotics',
    'Virtual Reality',
    'Human-Computer Interaction',
    'Tactile Perception',
    'Shape Display Devices'
  ]

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

  const goals = [
    {
      title: locale === 'ja' ? '深部感覚に基づく形状・剛性・重量提示の確立' : 'Establish depth-sensation-based shape/rigidity/weight rendering',
      description: locale === 'ja'
        ? '指先接平面の傾き操作を核とした提示設計を洗練し、形状・剛性・重量といった深部感覚プロパティを単一デバイスで高効率に提示できる方式を確立します。'
        : 'Refine fingertip contact tilt manipulation to efficiently render shape, rigidity, and weight with a single handheld device leveraging depth sensation.'
    },
    {
      title: locale === 'ja' ? '期待推定×スイッチングで視触覚の整合を最大化' : 'Maximize visuo-haptic coherency via expectation-aware switching',
      description: locale === 'ja'
        ? '手先位置・姿勢・力入力からユーザの触探索意図を機械学習で推定し、提示刺激を動的に切替えて没入感を損なうミスマッチを解消します。'
        : 'Infer user exploratory intent from position, orientation, and force to dynamically switch stimuli, eliminating expectation-stimulus mismatch.'
    },
    {
      title: locale === 'ja' ? '触錯覚の活用による装置の簡素化・小型化' : 'Simplify and miniaturize devices using haptic illusions',
      description: locale === 'ja'
        ? 'Grain-Based Compliance/Tilt などの触錯覚を応用し、機構依存を減らしながら知覚強度を担保する省アクチュエータ設計を推進します。'
        : 'Leverage illusions like Grain-Based Compliance/Tilt to reduce mechanical complexity while maintaining perceived intensity.'
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
                  ? '私は奈良先端科学技術大学院大学（NAIST）の博士課程学生です。触覚技術、ロボティクス、バーチャルリアリティの研究に従事しています。特に、人間の触覚的形状認知特性に着目したハンドヘルド型形状提示装置「FresnelShape」の開発と評価を行っています。VR環境における触覚体験の向上を目指しています。'
                  : 'I am a Ph.D. student at the Nara Institute of Science and Technology (NAIST). I am engaged in research on haptic technology, robotics, and virtual reality. Specifically, I am developing and evaluating "FresnelShape," a handheld shape display device focusing on human tactile shape perception characteristics. I aim to enhance tactile experiences in VR environments.'
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
                  <div className="mb-2 space-y-1">
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
                    {locale === 'ja' ? '触覚技術・ハプティクス' : 'Haptic Technology & Haptics'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ja'
                      ? 'FresnelShapeをはじめとする新しい触覚デバイスの開発と、人間の触覚認知特性の研究を行っています。'
                      : 'Developing novel haptic devices like FresnelShape and researching human tactile perception characteristics.'
                    }
                  </p>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">
                    {locale === 'ja' ? 'バーチャルリアリティ' : 'Virtual Reality'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ja'
                      ? 'VR環境における触覚体験の向上を目指し、より没入感のあるインタラクション技術を開発しています。'
                      : 'Aiming to enhance tactile experiences in VR environments and develop more immersive interaction technologies.'
                    }
                  </p>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">
                    {locale === 'ja' ? 'ロボティクス' : 'Robotics'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ja'
                      ? '人間とロボットの触覚的インタラクションや、ハンドヘルド型デバイスの制御技術を研究しています。'
                      : 'Researching tactile interaction between humans and robots, and control technologies for handheld devices.'
                    }
                  </p>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">
                    {locale === 'ja' ? '人間-コンピュータインタラクション' : 'Human-Computer Interaction'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ja'
                      ? '触覚インターフェースの設計と評価を通じて、より自然で直感的なユーザー体験の実現を目指しています。'
                      : 'Aiming to realize more natural and intuitive user experiences through the design and evaluation of haptic interfaces.'
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

        {/* Extracurriculars */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold flex items-center">
            <Award className="mr-3 h-6 w-6" />
            {locale === 'ja' ? '課外活動' : 'Extracurricular Activities'}
          </h3>
          <div className="space-y-3">
            <Card><CardContent className="p-6"><ul className="list-disc pl-6 space-y-1">
              <li>{locale === 'ja' ? '缶サット甲子園 全国大会準優勝（通算2回）' : 'Cansat Koshien: National runner-up (twice)'}</li>
              <li>{locale === 'ja' ? 'Google Science Jam 2015 JAXA審査員賞' : 'Google Science Jam 2015: JAXA Jury Prize'}</li>
              <li>{locale === 'ja' ? 'IVRC 2022 SEED STAGE 選出' : 'IVRC 2022: Selected for SEED STAGE'}</li>
              <li>{locale === 'ja' ? '関西テック・クリエイティブ人材共創事業 採択' : 'Kansai Tech Creative Talent Co-creation: Selected'}</li>
            </ul></CardContent></Card>
          </div>
        </section>

        {/* Funding */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold flex items-center">
            <Award className="mr-3 h-6 w-6" />
            {locale === 'ja' ? '獲得資金' : 'Funding'}
          </h3>
          <Card>
            <CardContent className="p-6">
              <ul className="list-disc pl-6 space-y-1">
                <li>{locale === 'ja' ? '関西テッククリエイターチャレンジ：165万円' : 'Kansai Tech Creator Challenge: 1.65M JPY'}</li>
                <li>{locale === 'ja' ? 'JASSO 海外留学支援制度（協定派遣）：66万円' : 'JASSO Study Abroad Support (Exchange): 0.66M JPY'}</li>
                <li>{locale === 'ja' ? 'NAIST 長期留学支援制度：70万円' : 'NAIST Long-term Study Abroad Support: 0.7M JPY'}</li>
                <li>{locale === 'ja' ? 'JST 次世代研究者挑戦的研究プログラム（NAIST Granite）：総額約800万円' : 'JST Next-Gen Researcher Program (NAIST Granite): ~8.0M JPY total'}</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Academic contributions */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold flex items-center">
            <Award className="mr-3 h-6 w-6" />
            {locale === 'ja' ? '学術貢献' : 'Academic Contributions'}
          </h3>
          <Card>
            <CardContent className="p-6">
              <ul className="list-disc pl-6 space-y-1">
                <li>{locale === 'ja' ? '触覚若手の会 疑似査読者会議・デモ交流会（ベスプレ）' : 'Young Haptics community: mock reviewer meeting; demo exchange (Best Presentation)'}</li>
                <li>{locale === 'ja' ? '触覚講習会 2024（デモ展示）' : 'Haptics Tutorial 2024 (demo exhibit)'}</li>
                <li>{locale === 'ja' ? 'ICRA 2024 / IEEE VR 2025 Student Volunteer' : 'ICRA 2024 / IEEE VR 2025: Student Volunteer'}</li>
                <li>{locale === 'ja' ? 'AHs / WHC 2025 査読協力' : 'AHs / WHC 2025: Reviewer'}</li>
              </ul>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  )
}

