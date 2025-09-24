
import type { CSSProperties } from 'react'
import { Card, CardContent } from './ui/card'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Project, Locale } from '../lib/types'

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

interface ProjectCardProps {
  project: Project
  locale: Locale
  onClick?: () => void
}

export function ProjectCard({ project, locale, onClick }: ProjectCardProps) {
  const mainCategory = project.tags[0] || ''
  const authorName = locale === 'ja' ? '太田裕紀' : 'Ota Hiroki'
  const summaryText = project.summary ?? ''

  const formatProjectDate = (dateString: string) => {
    const date = new Date(dateString)
    if (locale === 'ja') {
      return `${date.getFullYear()}年${date.getMonth() + 1}月`
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
  }

  return (
    <Card
      className="group cursor-pointer overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
      onClick={onClick}
    >
      {project.heroImage && (
        <div className="relative aspect-[3/2] overflow-hidden">
          <ImageWithFallback
            src={project.heroImage}
            alt={project.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <CardContent className="px-4 pb-4 pt-3 flex flex-col justify-between h-[180px]">
        <div>
          {mainCategory && (
            <div className="mb-2">
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                {mainCategory}
              </span>
            </div>
          )}

          <h3 className="text-lg font-bold leading-tight text-foreground mb-3" style={CLAMP_STYLES}>
            {project.title}
          </h3>

          <p className="text-muted-foreground text-xs leading-relaxed mt-0 mb-4" style={CLAMP_STYLES}>
            {summaryText}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src="/avatar-placeholder.jpg" />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {authorName.split(' ').map((name) => name[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-xs">{authorName}</span>
          </div>

          <span className="text-muted-foreground text-xs">{formatProjectDate(project.date)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
