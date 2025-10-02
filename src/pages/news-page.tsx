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
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    tag: '',
    year: '',
    q: ''
  })

  const t = getTranslations(locale)
  const itemsPerPage = 6

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const allPosts = await getNewsPosts(locale, {
          tag: filters.tag || undefined,
          year: filters.year ? parseInt(filters.year, 10) : undefined,
          q: filters.q || undefined
        })
        setPosts(allPosts)
        setCurrentPage(1)
      } catch (error) {
        console.error('Failed to fetch news posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
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

        <div className="mx-auto max-w-4xl">
          <NewsFilters
            locale={locale}
            availableTags={availableTags}
            availableYears={availableYears}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {!loading && (
          <div className="text-center text-muted-foreground">
            {locale === 'ja'
              ? `${posts.length}件の記事が見つかりました`
              : `Found ${posts.length} article${posts.length !== 1 ? 's' : ''}`}
          </div>
        )}

        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <NewsSkeleton key={index} />
              ))}
            </div>
          ) : currentPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentPosts.map((post) => (
                <NewsCard
                  key={post.id}
                  post={post}
                  locale={locale}
                  onClick={() => onNavigate('news-detail', post.slug)}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="space-y-4">
                <div className="text-6xl opacity-50">📝</div>
                <h3 className="text-xl font-semibold">
                  {locale === 'ja' ? '記事が見つかりません' : 'No articles found'}
                </h3>
                <p className="text-muted-foreground">
                  {locale === 'ja'
                    ? '検索条件を変更してお試しください。'
                    : 'Try adjusting your search filters.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {totalPages > 1 && (
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
