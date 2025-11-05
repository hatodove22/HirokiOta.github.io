
import type { CSSProperties } from 'react'
import { Card, CardContent } from './ui/card'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { NewsPost, Locale } from '../lib/types'
import { formatDate, formatDateJa, getRandomEmojiForNews } from '../lib/utils'

const CLAMP_STYLES: CSSProperties = (() => {
  const styles: CSSProperties = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }

  ;(styles as CSSProperties & { lineClamp?: number }).lineClamp = 2
  return styles
})()

interface NewsCardProps {
  post: NewsPost
  locale: Locale
  onClick?: () => void
}

export function NewsCard({ post, locale, onClick }: NewsCardProps) {
  const primaryTag = post.tags?.[0] ?? ''
  const summaryText = post.summary ?? ''
  const publishedAt = locale === 'ja' ? formatDateJa(post.date) : formatDate(post.date)
  const hasHeroImage = post.heroImage && post.heroImage.trim() !== ''
  const emoji = getRandomEmojiForNews(post.id || post.slug)

  return (
    <Card
      className="group cursor-pointer overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex h-full flex-col"
      onClick={onClick}
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        {hasHeroImage ? (
          <ImageWithFallback
            src={post.heroImage!}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div 
            className="flex items-center justify-center h-full w-full transition-colors duration-300"
            style={{ backgroundColor: '#88beca' }}
          >
            <span className="text-[100px] md:text-[120px] lg:text-[140px]" role="img" aria-label="News" style={{ fontSize: '100px' }}>
              {emoji}
            </span>
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3">
        <div className="space-y-3">
          {primaryTag && (
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {primaryTag}
            </span>
          )}

          <h3 className="text-lg font-bold leading-tight text-foreground" style={CLAMP_STYLES}>
            {post.title}
          </h3>

          <p className="text-sm leading-relaxed text-muted-foreground" style={CLAMP_STYLES}>
            {summaryText}
          </p>
        </div>

        <div className="mt-auto">
          <span className="text-muted-foreground text-xs">{publishedAt}</span>
        </div>
      </CardContent>
    </Card>
  )
}
