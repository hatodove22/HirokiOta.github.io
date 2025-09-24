
import type { CSSProperties } from 'react'
import { Calendar } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { BlogPost, Locale } from '../lib/types'
import { formatDate, formatDateJa } from '../lib/utils'

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

interface BlogCardProps {
  post: BlogPost
  locale: Locale
  onClick?: () => void
}

export function BlogCard({ post, locale, onClick }: BlogCardProps) {
  const authorName = locale === 'ja' ? '太田裕紀' : 'Ota Hiroki'
  const primaryTag = post.tags[0] || ''
  const summaryText = post.summary ?? ''
  const publishedAt = locale === 'ja' ? formatDateJa(post.date) : formatDate(post.date)

  return (
    <Card
      className="group cursor-pointer overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex h-full flex-col"
      onClick={onClick}
    >
      {post.heroImage && (
        <div className="relative aspect-[3/2] overflow-hidden">
          <ImageWithFallback
            src={post.heroImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

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

          <p className="text-xs leading-relaxed text-muted-foreground" style={CLAMP_STYLES}>
            {summaryText}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src="/avatar-placeholder.jpg" alt={authorName} />
              <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
                {authorName.split(' ').map((name) => name[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span>{authorName}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{publishedAt}</span>
            {post.readTime && <span>・{post.readTime}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
