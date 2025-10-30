import React, { useEffect, useState, type ReactNode } from 'react'
import { ArrowRight, Download, ExternalLink, Mail, Github, Twitter, Linkedin, GraduationCap, IdCard } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { ProjectCard } from '../components/project-card'
import { NewsCard } from '../components/news-card'
import { PaperListItem } from '../components/paper-list-item'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { Locale, Project, NewsItem, Paper, NewsPost } from '../lib/types'
import { getTranslations } from '../lib/i18n'
import { getPinnedProjects, getRecentPapers, getLatestNewsPosts } from '../lib/notion'
import { formatDate, formatDateJa } from '../lib/utils'
import profileImage from 'figma:asset/37d3f31165fb6b41b77513c4d8e0d1b581053602.png'

interface HomePageProps {
  locale: Locale
  onNavigate: (page: string, slug?: string) => void
}



function HeroSocialLink({ href, label, children }: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex size-10 items-center justify-center rounded-full border border-border hover:border-border-strong hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
    >
      <span className="sr-only">{label}</span>
      {children}
    </a>
  );
}

export function HomePage({ locale, onNavigate }: HomePageProps) {
  const [pinnedProjects, setPinnedProjects] = useState<Project[]>([])
  const [latestNews, setLatestNews] = useState<NewsPost[]>([])
  const [recentPapers, setRecentPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  
  const t = getTranslations(locale)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, newsPosts, papers] = await Promise.all([
          getPinnedProjects(locale),
          getLatestNewsPosts(locale, 3),
          getRecentPapers(locale, 3)
        ])
        setPinnedProjects(projects)
        setLatestNews(newsPosts)
        setRecentPapers(papers)
      } catch (error) {
        console.error('Failed to fetch home page data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [locale])

  const researchAreas =
    locale === 'ja'
      ? ['バーチャルリアリティ', 'ロボティクス', '触覚', 'インターフェース']
      : ['Virtual Reality', 'Robotics', 'Haptics', 'Interfaces']
  const heroLines =
    locale === 'ja'
      ? {
          title: '博士課程学生',
          university: '奈良先端科学技術大学院大学',
          lab: 'サイバネティクスリアリティ工学研究室',
        }
      : {
          title: 'PhD Student',
          university: 'Nara Institute of Science and Technology (NAIST)',
          lab: 'Cybernetics Reality Engineering Laboratory',
        }

  const labUrl = 'https://carelab.info/ja/'


  return (
    <div className="flex flex-col space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative flex min-h-[100svh] items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-12">
            {/* Name + Photo row */}
            <div className="flex w-full items-center gap-6">
              <img
                src={profileImage}
                alt={t.about.profile.name}
                className="h-32 w-32 rounded-full object-cover shadow-lg md:h-32 md:w-32"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {t.about.profile.name}
                </h1>
                <div className="mt-2 space-y-1 text-base text-muted-foreground leading-tight md:text-lg">
                  <div>{heroLines.title}</div>
                  <div>{heroLines.university}</div>
                  <a
                    href={labUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary hover:underline"
                  >
                    {heroLines.lab}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* Social links under the header row */}
            <div className="mt-4 flex items-center gap-3 text-primary">
              <HeroSocialLink href="https://github.com/hatodove22" label="GitHub">
                <Github className="h-5 w-5" />
              </HeroSocialLink>
              <HeroSocialLink href="https://x.com/troll01234" label="X (Twitter)">
                <Twitter className="h-5 w-5" />
              </HeroSocialLink>
              <HeroSocialLink href="https://www.linkedin.com/in/hiroki-ota-54a11119b/" label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </HeroSocialLink>
              <HeroSocialLink href="https://scholar.google.co.kr/citations?user=zhDHaR4AAAAJ&hl" label="Google Scholar">
                <GraduationCap className="h-5 w-5" />
              </HeroSocialLink>
              <HeroSocialLink href="https://scholar.google.co.kr/citations?user=zhDHaR4AAAAJ&hl" label="ORCID">
                <IdCard className="h-5 w-5" />
              </HeroSocialLink>
            </div>

            <div className="mt-4 flex w-full flex-wrap gap-4">
              {researchAreas.map((area) => (
                <Badge key={area} variant="secondary" className="text-sm">
                  {area}
                </Badge>
              ))}
            </div>

            <p className="mt-4 max-w-2xl text-left text-lg text-muted-foreground">
              {t.home.description}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
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
              {pinnedProjects.filter(p => p.language === locale).map((project) => (
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
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">{t.home.sections.news}</h2>
            <Button variant="ghost" onClick={() => onNavigate('news')} className="cursor-pointer">
              {t.common.readMore}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="h-64">
                  <CardContent className="h-full animate-pulse space-y-4 p-4">
                    <div className="bg-muted h-32 w-full rounded"></div>
                    <div className="bg-muted h-4 w-3/4 rounded"></div>
                    <div className="bg-muted h-3 w-1/2 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {latestNews.map((post) => (
                <NewsCard
                  key={post.id}
                  post={post}
                  locale={locale}
                  onClick={() => onNavigate('news-detail', post.slug)}
                />
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
                        ? '機械学習とコンピュータビジョンを専門とする博士課程学生。医療画像解析や自然言語処理の研究で成果を上げ、実世界の課題解決に向けた応用研究に取り組んでいる。'
                        : 'PhD student specializing in machine learning and computer vision. Award-winning researcher in medical image analysis and NLP at international conferences. Focused on practical applications for real-world problem solving.'
                      }
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Bio (150 words)</h4>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ja'
                        ? '太田裕紀は奈良先端科学技術大学院大学の博士課程学生で、機械学習とコンピュータビジョンを専門としています。特に医療画像解析と自然言語処理の分野で研究を進め、国際会議での発表や受賞歴があります。これまでにトップカンファレンスで多数の論文を発表し、実世界の課題解決に資する応用研究にも積極的に取り組んでいます。研究と並行してオープンソースへの貢献やコミュニティ活動も行っています。'
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

