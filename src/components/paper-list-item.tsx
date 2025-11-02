import { ExternalLink, FileText, Award as AwardIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Paper, Locale } from '../lib/types'
import { getTranslations } from '../lib/i18n'

interface PaperListItemProps {
  paper: Paper
  locale: Locale
  onCategoryClick?: (category: string, value: string) => void
}

export function PaperListItem({ paper, locale, onCategoryClick }: PaperListItemProps) {
  const t = getTranslations(locale)

  // Format authors with bold for self
  const formatAuthors = (authors: string) => {
    const parts = authors.split('**')
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // Bold part (between **)
        return <strong key={index}>{part}</strong>
      }
      return part
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-3">
          {/* Title and Award */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-medium leading-tight flex-1">
              {paper.title}
            </h3>
            {paper.award && (
              <Badge variant="secondary" className="flex items-center gap-1 whitespace-nowrap">
                <AwardIcon className="h-3 w-3" />
                {t.papers.award}
              </Badge>
            )}
          </div>

          {/* Authors */}
          <p className="text-sm text-muted-foreground">
            {formatAuthors(paper.authors)}
          </p>

          {/* Venue and Year */}
          <p className="text-sm font-medium">
            {paper.venue}, {paper.year}
          </p>

          {/* Links */}
          <div className="flex flex-wrap gap-2">
            {paper.url && (
              <Button asChild variant="outline" size="sm">
                <a href={paper.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  URL
                </a>
              </Button>
            )}
            {paper.pdfUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </a>
              </Button>
            )}
            {paper.doi && (
              <Button asChild variant="outline" size="sm">
                <a href={paper.doi} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  DOI
                </a>
              </Button>
            )}
            
            {paper.arxiv && (
              <Button asChild variant="outline" size="sm">
                <a href={paper.arxiv} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  arXiv
                </a>
              </Button>
            )}
            
            {paper.slidesUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={paper.slidesUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  Slides
                </a>
              </Button>
            )}
            
            {paper.posterUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={paper.posterUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  Poster
                </a>
              </Button>
            )}
          </div>

          {/* Award details */}
          {paper.award && (
            <div className="pt-2 border-t">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                🏆 {paper.award}
              </p>
            </div>
          )}

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge 
              variant="outline" 
              className={`text-sm py-1 px-3 ${onCategoryClick ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}`}
              onClick={() => onCategoryClick?.('scope', paper.categories.scope)}
            >
              {t.papers.categories.scope[paper.categories.scope]}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-sm py-1 px-3 ${onCategoryClick ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}`}
              onClick={() => onCategoryClick?.('type', paper.categories.type)}
            >
              {t.papers.categories.type[paper.categories.type]}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-sm py-1 px-3 ${onCategoryClick ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}`}
              onClick={() => onCategoryClick?.('peerReview', paper.categories.peerReview)}
            >
              {t.papers.categories.peerReview[paper.categories.peerReview]}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}