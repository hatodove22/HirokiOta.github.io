import { useEffect, useState } from 'react'
import { ArrowLeft, Calendar, ExternalLink, Github, FileText, Users, Tag } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/breadcrumb'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { Locale, Project, Paper } from '../lib/types'
import { getTranslations } from '../lib/i18n'
import { getProjectBySlug, getPapers } from '../lib/notion'
import { formatDate, formatDateJa } from '../lib/utils'

interface ProjectDetailPageProps {
  locale: Locale
  slug: string
  onNavigate: (page: string, slug?: string) => void
}

export function ProjectDetailPage({ locale, slug, onNavigate }: ProjectDetailPageProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [relatedPapers, setRelatedPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  
  const t = getTranslations(locale)

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      try {
        const projectData = await getProjectBySlug(locale, slug)
        if (projectData) {
          setProject(projectData)
          
          // Fetch related papers
          if (projectData.relatedPapers.length > 0) {
            const papers = await getPapers(locale)
            const related = papers.filter(paper => 
              projectData.relatedPapers.includes(paper.id)
            )
            setRelatedPapers(related)
          }
        }
      } catch (error) {
        console.error('Failed to fetch project:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [locale, slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-64"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="text-6xl opacity-50">😕</div>
          <h1 className="text-2xl font-semibold">{t.common.notFound}</h1>
          <p className="text-muted-foreground">
            {locale === 'ja' 
              ? 'お探しのプロジェクトが見つかりません。'
              : 'The project you\'re looking for could not be found.'
            }
          </p>
          <Button onClick={() => onNavigate('projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.common.backTo} {t.projects.title}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={() => onNavigate('projects')}
                className="cursor-pointer"
              >
                {t.projects.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <Button variant="ghost" onClick={() => onNavigate('projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.common.backTo} {t.projects.title}
        </Button>

        {/* Hero Section */}
        <div className="space-y-6">
          {project.heroImage && (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <ImageWithFallback
                src={project.heroImage}
                alt={project.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-4xl font-bold">{project.title}</h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {locale === 'ja' ? formatDateJa(project.date) : formatDate(project.date)}
              </div>
              
              {project.tags.length > 0 && (
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {project.demoUrl && (
                <Button asChild>
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t.projects.card.demo}
                  </a>
                </Button>
              )}
              
              {project.repoUrl && (
                <Button variant="outline" asChild>
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    {t.projects.card.repo}
                  </a>
                </Button>
              )}
              
              {project.slidesUrl && (
                <Button variant="outline" asChild>
                  <a href={project.slidesUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4" />
                    Slides
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === 'ja' ? '概要' : 'Summary'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {project.summary}
            </p>
          </CardContent>
        </Card>

        {/* Project Details */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">
            {locale === 'ja' ? 'プロジェクト詳細' : 'Project Details'}
          </h2>

          {/* Main Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {project.body.map((block, index) => {
              switch (block.type) {
                case 'paragraph':
                  return (
                    <p key={index} className="mb-4 leading-relaxed">
                      {block.content}
                    </p>
                  )
                case 'heading':
                  return (
                    <h3 key={index} className="text-xl font-semibold mt-8 mb-4">
                      {block.content}
                    </h3>
                  )
                case 'list':
                  return (
                    <ul key={index} className="list-disc pl-6 mb-4 space-y-1">
                      {block.children?.map((child, childIndex) => (
                        <li key={childIndex}>{child.content}</li>
                      ))}
                    </ul>
                  )
                default:
                  return (
                    <div key={index} className="mb-4">
                      {block.content}
                    </div>
                  )
              }
            })}
          </div>

          {/* Sample content for demonstration */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {locale === 'ja' ? '問題設定' : 'Problem Statement'}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {locale === 'ja'
                  ? 'このプロジェクトでは、従来の手法では解決が困難だった課題に取り組みました。特に、大規模なデータセットにおける処理速度と精度の両立が求められていました。'
                  : 'This project addressed challenges that were difficult to solve with conventional methods. In particular, we needed to achieve both processing speed and accuracy on large-scale datasets.'
                }
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                {locale === 'ja' ? 'アプローチ' : 'Approach'}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {locale === 'ja'
                  ? '深層学習を基盤とした新しいアーキテクチャを提案し、効率的な学習アルゴリズムを開発しました。また、実装においては最新のGPU技術を活用し、大幅な処理速度向上を実現しました。'
                  : 'We proposed a new architecture based on deep learning and developed efficient learning algorithms. In implementation, we leveraged the latest GPU technology to achieve significant improvements in processing speed.'
                }
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                {locale === 'ja' ? '成果・インパクト' : 'Results & Impact'}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {locale === 'ja'
                  ? '従来手法と比較して20%の精度向上と3倍の処理速度向上を実現しました。この成果は国際会議で発表され、複数の企業から実用化に向けた問い合わせをいただいています。'
                  : 'We achieved 20% improvement in accuracy and 3x faster processing speed compared to conventional methods. These results were presented at international conferences and have received inquiries from multiple companies for practical implementation.'
                }
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                {locale === 'ja' ? '技術スタック' : 'Tech Stack'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Python', 'PyTorch', 'Docker', 'AWS', 'React', 'TypeScript'].map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Papers */}
        {relatedPapers.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
              {locale === 'ja' ? '関連論文' : 'Related Papers'}
            </h2>
            
            <div className="space-y-4">
              {relatedPapers.map((paper) => (
                <Card key={paper.id}>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <h3 className="font-medium">{paper.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {paper.authors.split('**').map((part, index) => 
                          index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                        )}
                      </p>
                      <p className="text-sm">
                        {paper.venue}, {paper.year}
                        {paper.award && (
                          <Badge variant="secondary" className="ml-2">
                            {paper.award}
                          </Badge>
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}