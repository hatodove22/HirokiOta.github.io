import React, { useEffect, useState } from 'react'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
// import { Separator } from '../components/ui/separator'
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

  const renderInlineBold = (text: string) => {
    const parts = String(text).split('**')
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <React.Fragment key={i}>{part}</React.Fragment>))
  }

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
            {t.common.backTo}
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
          {t.common.backTo}
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

          {/* YouTube embed moved below details by request */}

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

            {/* Action buttons removed by request */}
          </div>
        </div>

        {/* Summary (highlighted text, no box) */}
        <div className="px-2 md:px-0 py-2">
          <p className="leading-relaxed text-primary font-medium">
            {project.summary}
          </p>
        </div>

        {/* Demo video (YouTube) right below summary if provided */}
        {project.demoUrl && /youtube\.com|youtu\.be/.test(project.demoUrl) && (
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">
              {locale === 'ja' ? 'デモ動画' : 'Demo Video'}
            </h2>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <iframe
                className="w-full h-full"
                src={(() => {
                  const m = project.demoUrl!.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)
                  const id = m ? m[1] : ''
                  return id ? `https://www.youtube.com/embed/${id}` : project.demoUrl!
                })()}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Project Details */}
        <div className="space-y-6">
          {/* Main Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {(() => {
              let insertAfterNextParagraph: 'approach' | 'benefit' | null = null
              return project.body.map((block, index) => {
                switch (block.type) {
                case 'paragraph':
                  // YouTube 埋め込み（URLのみの段落をiframe化）
                  {
                    const yt = typeof block.content === 'string' && block.content.trim()
                    const ytMatch = yt && yt.match(/^(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11})(?:[&#?].*)?$/)
                    if (ytMatch) {
                      const url = new URL(ytMatch[1])
                      const videoId = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v')
                      const embed = `https://www.youtube.com/embed/${videoId}`
                        return (
                          <div key={index} className="aspect-video w-full overflow-hidden rounded-lg">
                            <iframe
                              className="w-full h-full"
                              src={embed}
                              title="YouTube video"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        )
                    }
                  }
                  // Markdown画像行を検出して画像として描画
                  {
                    const img = typeof block.content === 'string' && block.content.trim()
                    const imgMatch = img && img.match(/^!\[[^\]]*\]\(([^)]+)\)$/)
                    if (imgMatch) {
                      const src = imgMatch[1]
                      return (
                        <div key={index} className="my-4">
                          <ImageWithFallback src={src} alt="image" className="w-full rounded-lg" />
                        </div>
                      )
                    }
                  }
                    {
                      const elements: any[] = [
                        <p key={`p-${index}`} className="mb-4 leading-relaxed text-muted-foreground">
                          {renderInlineBold(block.content as string)}
                        </p>
                      ]
                      if (project.slug === 'tape-tics' && insertAfterNextParagraph) {
                        if (insertAfterNextParagraph === 'approach') {
                          elements.push(
                            <div key={`img-usage-${index}`} className="my-4">
                              <ImageWithFallback
                                src="/content/projects/project-3-tape-tics/images/usage.jpg"
                                alt="Tape‑tics usage"
                                className="w-full rounded-lg"
                              />
                            </div>
                          )
                        } else if (insertAfterNextParagraph === 'benefit') {
                          elements.push(
                            <div key={`img-usage2-${index}`} className="my-4">
                              <ImageWithFallback
                                src="/content/projects/project-3-tape-tics/images/Usage2.png"
                                alt="Tape‑tics benefits"
                                className="w-full rounded-lg"
                              />
                            </div>
                          )
                        }
                        insertAfterNextParagraph = null
                      }
                      return <React.Fragment key={index}>{elements}</React.Fragment>
                    }
                case 'heading':
                  if ((block as any).level === 1) {
                    return (
                      <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
                        {renderInlineBold((block as any).content as string)}
                      </h1>
                    )
                  } else if ((block as any).level === 2) {
                      if (project.slug === 'tape-tics') {
                        const text = String((block as any).content)
                        if (/^\s*アプローチ\s*$/i.test(text) || /^\s*Approach\s*$/i.test(text)) {
                          insertAfterNextParagraph = 'approach'
                        } else if (/(^\s*(何|なに)がうれしいか\s*$)|(^\s*嬉しい点\s*$)|(^\s*メリット\s*$)|(^\s*Benefits?\s*$)/i.test(text)) {
                          insertAfterNextParagraph = 'benefit'
                        }
                      }
                    return (
                      <h2 key={index} className="text-2xl font-semibold mt-8 mb-4">
                        {renderInlineBold((block as any).content as string)}
                      </h2>
                    )
                  }
                  return (
                    <h3 key={index} className="text-xl font-semibold mt-8 mb-4">
                      {renderInlineBold((block as any).content as string)}
                    </h3>
                  )
                case 'list':
                  return null
                default:
                  return (
                    <div key={index} className="mb-4">
                      {block.content}
                    </div>
                  )
                }
              })
            })()}
          </div>

          {/* extra sample content removed; description.md is the single source of truth */}
        </div>

        {/* Demo video moved above under summary */}

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
                      {/* Links */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {paper.url && (
                          <a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-xs underline opacity-80 hover:opacity-100">
                            URL
                          </a>
                        )}
                        {paper.pdfUrl && (
                          <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline opacity-80 hover:opacity-100">
                            PDF
                          </a>
                        )}
                        {paper.doi && (
                          <a href={paper.doi} target="_blank" rel="noopener noreferrer" className="text-xs underline opacity-80 hover:opacity-100">
                            DOI
                          </a>
                        )}
                        {paper.arxiv && (
                          <a href={paper.arxiv} target="_blank" rel="noopener noreferrer" className="text-xs underline opacity-80 hover:opacity-100">
                            arXiv
                          </a>
                        )}
                        {paper.slidesUrl && (
                          <a href={paper.slidesUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline opacity-80 hover:opacity-100">
                            Slides
                          </a>
                        )}
                        {paper.posterUrl && (
                          <a href={paper.posterUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline opacity-80 hover:opacity-100">
                            Poster
                          </a>
                        )}
                      </div>
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