import React, { useEffect, useState } from 'react'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/breadcrumb'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { Locale, NewsPost } from '../lib/types'
import { getTranslations } from '../lib/i18n'
import { getNewsPostBySlug } from '../lib/notion'
import { formatDate, formatDateJa, getRandomEmojiForNews } from '../lib/utils'

interface NewsDetailPageProps {
  locale: Locale
  slug: string
  onNavigate: (page: string, slug?: string) => void
}

export function NewsDetailPage({ locale, slug, onNavigate }: NewsDetailPageProps) {
  const [post, setPost] = useState<NewsPost | null>(null)
  const [loading, setLoading] = useState(true)

  const t = getTranslations(locale)

  const renderInlineBold = (text: string) => {
    const parts = String(text).split('**')
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <React.Fragment key={i}>{part}</React.Fragment>))
  }

  const renderInlineMarkdown = (text: string) => {
    // 太字、斜体、リンクを段階的に処理
    const parts: React.ReactNode[] = []
    let keyCounter = 0
    
    // まず太字を処理
    const boldParts = String(text).split('**')
    boldParts.forEach((boldPart, boldIndex) => {
      if (boldIndex % 2 === 1) {
        // 太字部分
        const boldContent = processItalicAndLinks(boldPart, keyCounter)
        parts.push(
          <strong key={`bold-${keyCounter++}`}>
            {boldContent.length === 1 ? boldContent[0] : <>{boldContent}</>}
          </strong>
        )
      } else {
        // 通常のテキスト部分
        parts.push(...processItalicAndLinks(boldPart, keyCounter))
      }
      keyCounter += boldPart.length
    })
    
    function processItalicAndLinks(textPart: string, baseKey: number): React.ReactNode[] {
      const result: React.ReactNode[] = []
      let keyIdx = baseKey
      
      // 斜体を処理（単一の*で囲まれた部分、ただし**で囲まれた部分は除く）
      const italicParts = textPart.split(/(?<!\*)\*(?!\*)/)
      italicParts.forEach((italicPart, italicIndex) => {
        if (italicIndex % 2 === 1) {
          // 斜体部分
          const italicContent = processLinks(italicPart, keyIdx)
          result.push(
            <em key={`italic-${keyIdx++}`}>
              {italicContent.length === 1 ? italicContent[0] : <>{italicContent}</>}
            </em>
          )
        } else {
          // 通常のテキスト部分
          result.push(...processLinks(italicPart, keyIdx))
        }
        keyIdx += italicPart.length
      })
      
      return result.length > 0 ? result : [textPart]
    }
    
    function processLinks(textPart: string, baseKey: number): React.ReactNode[] {
      const result: React.ReactNode[] = []
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
      let lastIndex = 0
      let match
      let linkKey = baseKey
      
      while ((match = linkRegex.exec(textPart)) !== null) {
        // リンクの前のテキスト
        if (match.index > lastIndex) {
          result.push(
            <React.Fragment key={`text-${linkKey++}`}>
              {textPart.substring(lastIndex, match.index)}
            </React.Fragment>
          )
        }
        // リンク
        result.push(
          <a
            key={`link-${linkKey++}`}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:opacity-80"
          >
            {match[1]}
          </a>
        )
        lastIndex = match.index + match[0].length
      }
      
      // 残りのテキスト
      if (lastIndex < textPart.length) {
        const remainingText = textPart.substring(lastIndex)
        if (remainingText) {
          result.push(
            <React.Fragment key={`text-rest-${linkKey}`}>
              {remainingText}
            </React.Fragment>
          )
        }
      }
      
      return result.length > 0 ? result : [<React.Fragment key={`text-fallback-${linkKey}`}>{textPart}</React.Fragment>]
    }
    
    return parts.length > 0 ? parts : text
  }

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      try {
        const news = await getNewsPostBySlug(locale, slug)
        setPost(news)
      } catch (error) {
        console.error('Failed to fetch news post:', error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [locale, slug])

  const formatPublishedAt = (date: string) => (locale === 'ja' ? formatDateJa(date) : formatDate(date))

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
          <div className="aspect-video animate-pulse rounded-lg bg-muted" />
          <div className="space-y-3">
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <div className="text-6xl opacity-50">📝</div>
          <h1 className="text-2xl font-semibold">{t.common.notFound}</h1>
          <p className="text-muted-foreground">
            {locale === 'ja'
              ? 'お探しの記事が見つかりませんでした。'
              : "We couldn't find the news post you're looking for."}
          </p>
          <Button onClick={() => onNavigate('news')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.common.backTo}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => onNavigate('news')} className="cursor-pointer">
                {t.news.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="ghost" onClick={() => onNavigate('news')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.common.backTo}
        </Button>

        {/* Hero Section */}
        <div className="space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            {post.heroImage && post.heroImage.trim() !== '' ? (
              <ImageWithFallback
                src={post.heroImage}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div 
                className="flex items-center justify-center h-full w-full transition-colors duration-300 rounded-lg"
                style={{ backgroundColor: '#88beca' }}
              >
                <span className="text-[100px] md:text-[120px] lg:text-[140px]" role="img" aria-label="News" style={{ fontSize: '100px' }}>
                  {getRandomEmojiForNews(post.id || post.slug)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold">{post.title}</h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {formatPublishedAt(post.date)}
              </div>
              
              {(post.tags ?? []).length > 0 && (
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {post.readTime && (
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {post.readTime}
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="space-y-8">
          {/* Main Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
              {post.body && post.body.length > 0 ? (
                post.body.map((block, index) => {
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
                          <div key={index} className="aspect-video w-full overflow-hidden rounded-lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
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
                          <div key={index} style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                            <ImageWithFallback src={src} alt="image" className="w-full rounded-lg" />
                          </div>
                        )
                      }
                    }
                    // 空の段落はスキップ（ただし、連続する空行は1つの段落として表示）
                    const content = String(block.content).trim()
                    if (!content) {
                      return null
                    }
                    return (
                      <p key={`p-${index}`} className="mb-6 leading-relaxed text-body">
                        {renderInlineMarkdown(block.content as string)}
                      </p>
                    )
                  case 'heading':
                    if ((block as any).level === 1) {
                      return (
                        <h1 
                          key={index} 
                          className="text-3xl font-bold mb-4"
                          style={{ marginTop: '4rem' }}
                        >
                          {renderInlineMarkdown((block as any).content as string)}
                        </h1>
                      )
                    } else if ((block as any).level === 2) {
                      return (
                        <h2 
                          key={index} 
                          className="text-2xl font-semibold mb-4"
                          style={{ marginTop: '2.5rem' }}
                        >
                          {renderInlineMarkdown((block as any).content as string)}
                        </h2>
                      )
                    } else if ((block as any).level === 3) {
                      return (
                        <h3 
                          key={index} 
                          className="text-xl font-semibold mb-4"
                          style={{ marginTop: '2rem' }}
                        >
                          {renderInlineMarkdown((block as any).content as string)}
                        </h3>
                      )
                    } else if ((block as any).level === 4) {
                      return (
                        <h4 
                          key={index} 
                          className="text-lg font-semibold mb-3"
                          style={{ marginTop: '1.5rem' }}
                        >
                          {renderInlineMarkdown((block as any).content as string)}
                        </h4>
                      )
                    } else if ((block as any).level === 5) {
                      return (
                        <h5 
                          key={index} 
                          className="text-base font-semibold mb-3"
                          style={{ marginTop: '1.25rem' }}
                        >
                          {renderInlineMarkdown((block as any).content as string)}
                        </h5>
                      )
                    }
                    return (
                      <h6 
                        key={index} 
                        className="text-sm font-semibold mb-2"
                        style={{ marginTop: '1rem' }}
                      >
                        {renderInlineMarkdown((block as any).content as string)}
                      </h6>
                    )
                  case 'list':
                    if (block.children && block.children.length > 0) {
                      // 番号付きリストかどうかを判定
                      const isOrdered = (block as any).ordered === true
                      if (isOrdered) {
                        return (
                          <ol 
                            key={index} 
                            className="ml-8 list-decimal space-y-2 pl-6"
                            style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', marginTop: '1.25rem', marginBottom: '1.25rem' }}
                          >
                            {block.children.map((item, itemIndex) => (
                              <li key={itemIndex} className="leading-relaxed text-body pl-2" style={{ display: 'list-item' }}>
                                {renderInlineMarkdown(item.content)}
                              </li>
                            ))}
                          </ol>
                        )
                      }
                      return (
                        <ul 
                          key={index} 
                          className="ml-8 list-disc space-y-2 pl-6"
                          style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '1.25rem', marginBottom: '1.25rem' }}
                        >
                          {block.children.map((item, itemIndex) => (
                            <li key={itemIndex} className="leading-relaxed text-body pl-2" style={{ display: 'list-item' }}>
                              {renderInlineMarkdown(item.content)}
                            </li>
                          ))}
                        </ul>
                      )
                    }
                    return null
                  default:
                    return (
                      <div key={index} className="mb-4">
                        {block.content}
                      </div>
                    )
                  }
                })
              ) : (
                <p className="leading-relaxed text-body">{post.content || post.summary || ''}</p>
              )}
          </div>
        </section>
      </div>
    </div>
  )
}
