import { useEffect, useMemo, useState } from 'react'
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
  const [allPosts, setAllPosts] = useState<NewsPost[]>([])
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
    let ignore = false

    const fetchNews = async () => {
      setLoading(true)
      try {
        const data = await getNewsPosts(locale)
        if (!ignore) {
          setAllPosts(data)
        }
      } catch (error) {
        console.error('Failed to load news posts:', error)
        if (!ignore) {
          setAllPosts([])
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchNews()

    return () => {
      ignore = true
    }
  }, [locale])

  useEffect(() => {
    let filtered = allPosts

    if (filters.tag) {
      filtered = filtered.filter((post) => (post.tags ?? []).includes(filters.tag))
    }
    if (filters.year) {
      const selectedYear = Number(filters.year)
      filtered = filtered.filter(
        (post) => !Number.isNaN(selectedYear) && new Date(post.date).getFullYear() === selectedYear
      )
    }
    if (filters.q) {
      const query = filters.q.toLowerCase()
      filtered = filtered.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(query)
        const summaryMatch = (post.summary ?? '').toLowerCase().includes(query)
        const tagsMatch = (post.tags ?? []).some((tag) => tag.toLowerCase().includes(query))
        return titleMatch || summaryMatch || tagsMatch
      })
    }

    setPosts(filtered)
    setCurrentPage(1)
  }, [allPosts, filters])

  const totalPages = Math.max(1, Math.ceil(posts.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentPosts = posts.slice(startIndex, startIndex + itemsPerPage)

  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    for (const post of allPosts) {
      for (const tag of post.tags ?? []) {
        tags.add(tag)
      }
    }
    return Array.from(tags).sort((a, b) => a.localeCompare(b))
  }, [allPosts])

  const availableYears = useMemo(() => {
    const years = new Set<number>()
    for (const post of allPosts) {
      const year = new Date(post.date).getFullYear()
      if (!Number.isNaN(year)) {
        years.add(year)
      }
    }
    return Array.from(years).sort((a, b) => b - a)
  }, [allPosts])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFiltersChange = (nextFilters: { tag: string; year: string; q: string }) => {
    setFilters(nextFilters)
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

  const showPlaceholder = !loading && posts.length === 0

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{t.news.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.news.description}
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto">
          <NewsFilters
            locale={locale}
            availableTags={availableTags}
            availableYears={availableYears}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="text-center text-muted-foreground">
            {locale === 'ja'
              ? `${posts.length}件のニュースが見つかりました`
              : `Found ${posts.length} news ${posts.length === 1 ? 'post' : 'posts'}`}
          </div>
        )}

        {/* News Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <NewsSkeleton key={index} />
              ))}
            </div>
          ) : showPlaceholder ? (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="text-6xl opacity-50">🔍</div>
                <h3 className="text-xl font-semibold">
                  {locale === 'ja' ? 'ニュースが見つかりません' : 'No news found'}
                </h3>
                <p className="text-muted-foreground">
                  {locale === 'ja' 
                    ? '検索条件を変更してお試しください。'
                    : 'Try adjusting your search criteria.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post) => (
                <div 
                  key={post.id}
                  className="transition-transform hover:scale-105"
                >
                  <NewsCard
                    post={post}
                    locale={locale}
                    onClick={() => onNavigate('news-detail', post.slug)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {locale === 'ja' ? '前へ' : 'Previous'}
            </Button>
            
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <span key={pageNum} className="px-2">...</span>
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
