import { useEffect, useState } from 'react'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/breadcrumb'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { Locale, NewsPost } from '../lib/types'
import { getTranslations } from '../lib/i18n'
import { getNewsPostBySlug } from '../lib/notion'
import { formatDate, formatDateJa } from '../lib/utils'

interface NewsDetailPageProps {
  locale: Locale
  slug: string
  onNavigate: (page: string, slug?: string) => void
}

export function NewsDetailPage({ locale, slug, onNavigate }: NewsDetailPageProps) {
  const [post, setPost] = useState<NewsPost | null>(null)
  const [loading, setLoading] = useState(true)

  const t = getTranslations(locale)

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
            {t.common.backTo} {t.news.title}
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
          {t.common.backTo} {t.news.title}
        </Button>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground">
              {post.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatPublishedAt(post.date)}
              </span>
              {post.readTime && (
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              )}
            </div>
          </div>

          {post.heroImage && (
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <ImageWithFallback
                src={post.heroImage}
                alt={post.title}
                className="object-cover"
              />
            </div>
          )}

          <section className="space-y-8">
            {post.body.length > 0 ? (
              post.body.map((section, index) => (
                <div key={index} className="space-y-3">
                  <h2 className="text-2xl font-semibold">{section.heading}</h2>
                  <p className="leading-relaxed text-muted-foreground">{section.content}</p>
                </div>
              ))
            ) : (
              <p className="leading-relaxed text-muted-foreground">{post.summary}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
