import { Calendar } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Project, Locale } from '../lib/types'
import { getTranslations } from '../lib/i18n'
import { formatDate, formatDateJa, truncate } from '../lib/utils'

interface ProjectCardProps {
  project: Project
  locale: Locale
  onClick?: () => void
}

export function ProjectCard({ project, locale, onClick }: ProjectCardProps) {
  const t = getTranslations(locale)

  // Get the first tag as the main category
  const mainCategory = project.tags[0] || ''
  
  // Get author info from translations
  const authorName = locale === 'ja' ? '太田裕紀' : 'Ota Hiroki'

  // Format date to show only year and month
  const formatProjectDate = (dateString: string) => {
    const date = new Date(dateString)
    if (locale === 'ja') {
      return `${date.getFullYear()}年${date.getMonth() + 1}月`
    } else {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
    }
  }

  return (
    <Card className="group cursor-pointer overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" onClick={onClick}>
      {/* Hero Image */}
      {project.heroImage && (
        <div className="relative aspect-[3/2] overflow-hidden">
          <ImageWithFallback
            src={project.heroImage}
            alt={project.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      {/* Content */}
      <CardContent className="p-4 flex flex-col justify-between h-[180px]">
        <div>
          {/* Category */}
          {mainCategory && (
            <div className="mb-2">
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                {mainCategory}
              </span>
            </div>
          )}
          
          {/* Title */}
          <h3
            className="text-lg font-bold leading-tight text-foreground"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {project.title}
          </h3>
          
          {/* Description */}
          <p
            className="text-muted-foreground text-xs leading-relaxed mb-4"
            style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {truncate(project.summary, 120)}
          </p>
        </div>
        
        {/* Author and Date */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src="/avatar-placeholder.jpg" />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {authorName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-xs">
              {authorName}
            </span>
          </div>
          
          <span className="text-muted-foreground text-xs">
            {formatProjectDate(project.date)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}