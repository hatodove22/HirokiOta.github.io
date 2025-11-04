import { useEffect, useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { PaperListItem } from '../components/paper-list-item'
import { Skeleton } from '../components/ui/skeleton'
import { Locale, Paper } from '../lib/types'
import { getTranslations } from '../lib/i18n'
import { getPapers } from '../lib/notion'

interface PapersPageProps {
  locale: Locale
}

export function PapersPage({ locale }: PapersPageProps) {
  const [papers, setPapers] = useState<Paper[]>([])
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    year: '',
    venue: '',
    search: '',
    scope: '',
    type: '',
    peerReview: ''
  })

  const t = getTranslations(locale)

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true)
      try {
        const papersData = await getPapers(locale)
        setPapers(papersData)
        setFilteredPapers(papersData)
      } catch (error) {
        console.error('Failed to fetch papers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPapers()
  }, [locale])

  useEffect(() => {
    let filtered = papers

    // Filter by year
    if (filters.year) {
      filtered = filtered.filter(paper => paper.year.toString() === filters.year)
    }

    // Filter by venue
    if (filters.venue) {
      filtered = filtered.filter(paper => 
        paper.venue.toLowerCase().includes(filters.venue.toLowerCase())
      )
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(paper =>
        paper.title.toLowerCase().includes(searchTerm) ||
        paper.authors.toLowerCase().includes(searchTerm) ||
        paper.venue.toLowerCase().includes(searchTerm)
      )
    }

    // Filter by scope
    if (filters.scope) {
      filtered = filtered.filter(paper => paper.categories.scope === filters.scope)
    }

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(paper => paper.categories.type === filters.type)
    }

    // Filter by peer review
    if (filters.peerReview) {
      filtered = filtered.filter(paper => paper.categories.peerReview === filters.peerReview)
    }

    setFilteredPapers(filtered)
  }, [papers, filters])

  const updateFilter = (key: string, value: string) => {
    // Convert "all" to empty string for filtering logic
    const filterValue = value === 'all' ? '' : value
    setFilters(prev => ({ ...prev, [key]: filterValue }))
  }

  const handleCategoryClick = (category: string, value: string) => {
    updateFilter(category, value)
  }

  const clearFilters = () => {
    setFilters({ year: '', venue: '', search: '', scope: '', type: '', peerReview: '' })
  }

  // Get unique years and venues for filters
  const availableYears = [...new Set(papers.map(p => p.year))].sort((a, b) => b - a)
  const availableVenues = [...new Set(papers.map(p => p.venue))].sort()
  const availableScopes = [...new Set(papers.map(p => p.categories.scope))].sort()
  const availableTypes = [...new Set(papers.map(p => p.categories.type))].sort()
  const availablePeerReviews = [...new Set(papers.map(p => p.categories.peerReview))].sort()

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const PaperSkeleton = () => (
    <div className="space-y-3 p-6 border rounded-lg">
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-7 w-12" />
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-7 w-14" />
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{t.papers.title}</h1>
          <p className="text-lg text-muted-foreground">
            {locale === 'ja' 
              ? 'これまで発表した論文の一覧です。'
              : 'A list of papers I have published.'
            }
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={t.papers.filters.search}
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10 pr-4"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-3">
            <Select value={filters.year || undefined} onValueChange={(value) => updateFilter('year', value || 'all')}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t.papers.filters.year} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {locale === 'ja' ? 'すべて' : 'All'}
                </SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.venue || undefined} onValueChange={(value) => updateFilter('venue', value || 'all')}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t.papers.filters.venue} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {locale === 'ja' ? 'すべて' : 'All'}
                </SelectItem>
                {availableVenues.map((venue) => (
                  <SelectItem key={venue} value={venue}>
                    {venue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.scope || undefined} onValueChange={(value) => updateFilter('scope', value || 'all')}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={locale === 'ja' ? 'リリース範囲' : 'Scope'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {locale === 'ja' ? 'すべて' : 'All'}
                </SelectItem>
                {availableScopes.map((scope) => (
                  <SelectItem key={scope} value={scope}>
                    {scope}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.type || undefined} onValueChange={(value) => updateFilter('type', value || 'all')}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={locale === 'ja' ? 'タイプ' : 'Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {locale === 'ja' ? 'すべて' : 'All'}
                </SelectItem>
                {availableTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.peerReview || undefined} onValueChange={(value) => updateFilter('peerReview', value || 'all')}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={locale === 'ja' ? '査読' : 'Review'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {locale === 'ja' ? 'すべて' : 'All'}
                </SelectItem>
                {availablePeerReviews.map((peerReview) => (
                  <SelectItem key={peerReview} value={peerReview}>
                    {peerReview}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={clearFilters} size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {locale === 'ja' ? 'フィルタクリア' : 'Clear Filters'} ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="text-center text-muted-foreground">
            {locale === 'ja' 
              ? `${filteredPapers.length}件の論文が見つかりました`
              : `Found ${filteredPapers.length} paper${filteredPapers.length !== 1 ? 's' : ''}`
            }
          </div>
        )}

        {/* Papers List */}
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <PaperSkeleton key={i} />
              ))}
            </div>
          ) : filteredPapers.length > 0 ? (
            <div className="space-y-4">
              {filteredPapers.map((paper) => (
                <PaperListItem key={paper.id} paper={paper} locale={locale} onCategoryClick={handleCategoryClick} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="text-6xl opacity-50">📄</div>
                <h3 className="text-xl font-semibold">
                  {locale === 'ja' ? '論文が見つかりません' : 'No papers found'}
                </h3>
                <p className="text-muted-foreground">
                  {locale === 'ja' 
                    ? '検索条件を変更してお試しください。'
                    : 'Try adjusting your search criteria.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        {!loading && papers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{papers.length}</div>
              <p className="text-sm text-muted-foreground">
                {locale === 'ja' ? '総論文数' : 'Total Papers'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {papers.filter(p => p.award).length}
              </div>
              <p className="text-sm text-muted-foreground">
                {locale === 'ja' ? '受賞論文' : 'Award Papers'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {availableYears.length > 0 ? `${availableYears[availableYears.length - 1]} - ${availableYears[0]}` : '-'}
              </div>
              <p className="text-sm text-muted-foreground">
                {locale === 'ja' ? '発表年' : 'Publication Years'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}