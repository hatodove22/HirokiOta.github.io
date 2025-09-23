import { useEffect, useState } from 'react'
import { ArrowRight, Download, ExternalLink, Mail } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { ProjectCard } from '../components/project-card'
import { PaperListItem } from '../components/paper-list-item'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { Locale, Project, NewsItem, Paper } from '../lib/types'
import { getTranslations } from '../lib/i18n'
import { getPinnedProjects, getLatestNews, getRecentPapers } from '../lib/notion'
import { formatDate, formatDateJa } from '../lib/utils'
import profileImage from 'figma:asset/37d3f31165fb6b41b77513c4d8e0d1b581053602.png'

interface HomePageProps {
  locale: Locale
  onNavigate: (page: string, slug?: string) => void
}

export function HomePage({ locale, onNavigate }: HomePageProps) {
  const [pinnedProjects, setPinnedProjects] = useState<Project[]>([])
  const [latestNews, setLatestNews] = useState<NewsItem[]>([])
  const [recentPapers, setRecentPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  
  const t = getTranslations(locale)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, news, papers] = await Promise.all([
          getPinnedProjects(locale),
          getLatestNews(locale, 3),
          getRecentPapers(locale, 3)
        ])
        setPinnedProjects(projects)
        setLatestNews(news)
        setRecentPapers(papers)
      } catch (error) {
        console.error('Failed to fetch home page data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [locale])

  const researchAreas = ['Machine Learning', 'Deep Learning', 'Computer Vision']

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <img 
                src={profileImage} 
                alt={t.about.profile.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {t.about.profile.name}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                {t.home.title} · {t.home.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {researchAreas.map((area) => (
              <Badge key={area} variant="secondary" className="text-sm">
                {area}
              </Badge>
            ))}
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl">
            {t.home.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => onNavigate('about')}>
              {t.nav.about}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <a href="/cv.pdf" target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                {t.home.cta.cv}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">{t.home.sections.highlights}</h2>
            <Button variant="ghost" onClick={() => onNavigate('projects')}>
              {t.common.readMore}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="h-80">
                  <CardContent className="p-6 animate-pulse">
                    <div className="space-y-4">
                      <div className="bg-muted h-4 rounded w-3/4"></div>
                      <div className="bg-muted h-20 rounded"></div>
                      <div className="flex gap-2">
                        <div className="bg-muted h-6 rounded w-16"></div>
                        <div className="bg-muted h-6 rounded w-20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pinnedProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  locale={locale}
                  onClick={() => onNavigate('project-detail', project.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest News */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">{t.home.sections.news}</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4 animate-pulse cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="bg-muted h-4 rounded w-2/3"></div>
                        <div className="bg-muted h-3 rounded w-24"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {latestNews.map((news) => (
                <Card key={news.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent 
                    className="p-4"
                    onClick={() => {
                      if (news.link) {
                        window.open(news.link, '_blank', 'noopener,noreferrer')
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1">
                        <h3 className="font-medium">{news.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {locale === 'ja' ? formatDateJa(news.date) : formatDate(news.date)}
                        </p>
                      </div>
                      {news.link && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a href={news.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Papers */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">{t.home.sections.papers}</h2>
            <Button variant="ghost" onClick={() => onNavigate('papers')} className="cursor-pointer">
              {t.common.readMore}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 animate-pulse">
                    <div className="space-y-4">
                      <div className="bg-muted h-4 rounded w-3/4"></div>
                      <div className="bg-muted h-3 rounded w-1/2"></div>
                      <div className="bg-muted h-3 rounded w-2/3"></div>
                      <div className="flex gap-2">
                        <div className="bg-muted h-6 rounded w-16"></div>
                        <div className="bg-muted h-6 rounded w-20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentPapers.map((paper) => (
                <PaperListItem key={paper.id} paper={paper} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">{t.home.sections.contact}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.contact.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => onNavigate('contact')} className="cursor-pointer">
              {t.nav.contact}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <a href="mailto:taro.yamada@example.edu" className="cursor-pointer">
                <Mail className="mr-2 h-4 w-4" />
                {locale === 'ja' ? '直接メール' : 'Direct Email'}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Press Kit */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                {t.home.sections.pressKit}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t.home.sections.pressKit}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-2xl">👨‍🎓</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{t.about.profile.name}</h3>
                    <p className="text-muted-foreground">{t.about.profile.title}</p>
                    <p className="text-sm text-muted-foreground">{t.about.profile.affiliation}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Bio (50 words)</h4>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ja' 
                        ? '機械学習とコンピュータビジョンを専門とする博士課程学生。医療画像解析や自然言語処理の研究で複数の国際会議で受賞。実世界の問題解決に向けた応用研究に取り組んでいる。'
                        : 'PhD student specializing in machine learning and computer vision. Award-winning researcher in medical image analysis and NLP at international conferences. Focused on practical applications for real-world problem solving.'
                      }
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Bio (150 words)</h4>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ja'
                        ? '山田太郎は○○大学工学研究科の博士課程学生で、機械学習とコンピュータビジョンを専門としています。特に医療画像解析と自然言語処理の分野で革新的な研究を行い、MICCAI 2024でBest Paper Awardを受賞するなど、国際的に高い評価を受けています。これまでにトップカンファレンスで10本以上の論文を発表し、実世界の問題解決に向けた応用研究に積極的に取り組んでいます。研究と並行してオープンソースプロジェクトにも貢献し、技術コミュニティでの活動も活発に行っています。'
                        : 'Taro Yamada is a PhD student at the Graduate School of Engineering, XX University, specializing in machine learning and computer vision. He conducts innovative research particularly in medical image analysis and natural language processing, receiving international recognition including the Best Paper Award at MICCAI 2024. He has published over 10 papers at top-tier conferences and actively engages in applied research for real-world problem solving. Alongside his research, he contributes to open-source projects and is active in the technical community.'
                      }
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Links</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href="/cv.pdf" target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          CV
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer">
                          Google Scholar
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                          GitHub
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  )
}