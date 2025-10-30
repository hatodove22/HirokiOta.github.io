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
      title: locale === 'ja' ? '触覚技術の革新を推進する' : 'Advance haptic technology innovation',
      description: locale === 'ja'
        ? 'FresnelShapeをはじめとする新しい触覚デバイスの開発を通じて、VR環境での触覚体験を根本的に改善します。'
        : 'Fundamentally improve tactile experiences in VR environments through the development of novel haptic devices like FresnelShape.'
    },
    {
      title: locale === 'ja' ? '人間の触覚認知の理解を深める' : 'Deepen understanding of human tactile perception',
      description: locale === 'ja'
        ? '人間の触覚的形状認知特性の研究を通じて、より自然で直感的な触覚インターフェースの設計指針を確立します。'
        : 'Establish design guidelines for more natural and intuitive haptic interfaces through research on human tactile shape perception characteristics.'
    },
    {
      title: locale === 'ja' ? 'VR・ロボティクス分野での社会実装を目指す' : 'Aim for social implementation in VR and robotics',
      description: locale === 'ja'
        ? '研究成果を教育、医療、エンターテインメントなどの実用分野に応用し、社会に貢献できる技術の実現を目指します。'
        : 'Apply research findings to practical fields such as education, healthcare, and entertainment to realize technologies that contribute to society.'
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

      </div>
    </div>
  )
}

