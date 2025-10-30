import { useEffect, useState } from 'react'
import { NewsCard } from '../components/news-card'
import { NewsFilters } from '../components/news-filters'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { NewsPost, Locale } from '../lib/types'
import { getTranslations } from '../lib/i18n'
import { getNewsPosts } from '../lib/notion'

interface NewsPageProps {
  locale: Locale
  onNavigate: (page: string, slug?: string) => void
}

export function NewsPage({ locale, onNavigate }: NewsPageProps) {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    tag: '',
    year: '',
    q: ''
  })

  const t = getTranslations(locale)
  const itemsPerPage = 6

  useEffect(() => {
    // News fetching disabled during construction
    setPosts([])
    setCurrentPage(1)
  }, [locale, filters])

  const totalPages = Math.max(1, Math.ceil(posts.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentPosts = posts.slice(startIndex, startIndex + itemsPerPage)

  const availableTags = [...new Set(posts.flatMap((post) => post.tags))].sort()
  const availableYears = [...new Set(posts.map((post) => new Date(post.date).getFullYear()))].sort((a, b) => b - a)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const NewsSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-40 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">{t.news.title}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t.news.description}
          </p>
        </div>

        {/* Filters hidden during construction */}

        {/* Count hidden */}

        <div className="mx-auto max-w-7xl">
          <div className="py-16 text-center">
            <div className="space-y-4">
              <div className="text-6xl">🚧</div>
              <h3 className="text-xl font-semibold">
                {locale === 'ja' ? '現在工事中です' : 'Under construction'}
              </h3>
            </div>
          </div>
        </div>

        {false && totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {locale === 'ja' ? '前へ' : 'Previous'}
            </Button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1

              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? 'default' : 'outline'}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                )
              }

              if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                return (
                  <span key={pageNumber} className="px-2">
                    ...
                  </span>
                )
              }

              return null
            })}

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {locale === 'ja' ? '次へ' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
