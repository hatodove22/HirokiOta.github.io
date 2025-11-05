import React, { useEffect, useState } from 'react'
import { ArrowRight, Download, ExternalLink, Mail } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Tooltip, TooltipTrigger, TooltipContent } from '../components/ui/tooltip'
import { ProjectCard } from '../components/project-card'
import { NewsCard } from '../components/news-card'
import { PaperListItem } from '../components/paper-list-item'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { Locale, Project, NewsItem, Paper, NewsPost } from '../lib/types'
import { getTranslations } from '../lib/i18n'
import { getProjects, getRecentPapers, getLatestNewsPosts } from '../lib/notion'
import { formatDate, formatDateJa } from '../lib/utils'
import profileImage from 'figma:asset/37d3f31165fb6b41b77513c4d8e0d1b581053602.png'
import githubIcon from '../assets/icon/GitHub.svg'
import xIcon from '../assets/icon/X.svg'
import linkedinIcon from '../assets/icon/LinkedIn.svg'
import googleScholarIcon from '../assets/icon/GoogleScholar.svg'
import orcidIcon from '../assets/icon/ORCiD.svg'

interface HomePageProps {
  locale: Locale
  onNavigate: (page: string, slug?: string) => void
}



function HeroSocialLink({ href, label, iconSrc }: {
  href: string;
  label: string;
  iconSrc: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-[30px] items-center justify-center text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
        >
          <span className="sr-only">{label}</span>
          <img 
            src={iconSrc} 
            alt={label}
            className="h-full w-full object-contain"
            style={{ width: '25px', height: '25px' }}
          />
        </a>
      </TooltipTrigger>
      <TooltipContent>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function HomePage({ locale, onNavigate }: HomePageProps) {
  const [latestProjects, setLatestProjects] = useState<Project[]>([])
  const [latestNews, setLatestNews] = useState<NewsPost[]>([])
  const [recentPapers, setRecentPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  
  const t = getTranslations(locale)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allProjects, newsPosts, papers] = await Promise.all([
          getProjects(locale),
          getLatestNewsPosts(locale, 3),
          getRecentPapers(locale, 3)
        ])
        // 日付順でソートして最新4つを取得（プロジェクト一覧ページと同様に言語での除外は行わない）
        const latestProjects = allProjects
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 4)
        setLatestProjects(latestProjects)
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
                  <div>
                    {heroLines.title}
                    {locale === 'ja' ? ' / 日本学術振興会 特別研究員（DC2）' : ' / JSPS Research Fellow (DC2)'}
                  </div>
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
            <div className="mt-4 flex items-center gap-4 text-primary">
              <HeroSocialLink href="https://github.com/hatodove22" label="GitHub" iconSrc={githubIcon} />
              <HeroSocialLink href="https://x.com/troll01234" label="X (Twitter)" iconSrc={xIcon} />
              <HeroSocialLink href="https://www.linkedin.com/in/hiroki-ota-54a11119b/" label="LinkedIn" iconSrc={linkedinIcon} />
              <HeroSocialLink href="https://scholar.google.co.kr/citations?user=zhDHaR4AAAAJ&hl" label="Google Scholar" iconSrc={googleScholarIcon} />
              <HeroSocialLink href="https://orcid.org/0009-0003-5546-921X" label="ORCID" iconSrc={orcidIcon} />
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
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onNavigate('about')} 
                className="bg-transparent border-primary text-primary hover:bg-primary/10 hover:text-primary"
              >
                {t.nav.about}
                <ArrowRight className="ml-2 h-4 w-4" />
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
              {latestProjects.map((project) => (
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

      {/* Latest News moved to bottom; placeholder only */}


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

      {/* Latest News (above contact) */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">{t.home.sections.news}</h2>
            <Button variant="ghost" onClick={() => onNavigate('news')} className="cursor-pointer">
              {t.common.readMore}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="py-12 text-center text-muted-foreground">
            <div className="text-6xl mb-4">🚧</div>
            <p className="text-lg">{locale === 'ja' ? '現在工事中です' : 'Under construction'}</p>
          </div>
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
            
            {/* Press kit button removed as requested; keep only contact button */}
          </div>
        </div>
      </section>

      {/* Press Kit removed as requested */}

      
    </div>
  )
}

