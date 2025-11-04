import React, { useEffect, useState } from 'react'
import { ProjectCard } from '../components/project-card'
import { ProjectFilters } from '../components/project-filters'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { Locale, Project } from '../lib/types'
import { getTranslations } from '../lib/i18n'
import { getProjects } from '../lib/notion'

interface ProjectsPageProps {
  locale: Locale
  onNavigate: (page: string, slug?: string) => void
}

export function ProjectsPage({ locale, onNavigate }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([])
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
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const allProjects = await getProjects(locale, {
          tag: filters.tag || undefined,
          year: filters.year ? parseInt(filters.year) : undefined,
          q: filters.q || undefined
        })
        console.log('Fetched projects:', allProjects.length, allProjects.map(p => ({ id: p.id, title: p.title, language: p.language })))
        setProjects(allProjects)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [locale, filters])

  // 言語での除外は行わない（日本語UIでも英語データを含めて全件表示）
  const localeProjects = projects
  const totalPages = Math.ceil(localeProjects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = localeProjects.slice(startIndex, endIndex)

  // Get unique tags and years for filters
  const availableTags = Array.from(new Set(projects.flatMap(p => p.tags))) as string[]
  availableTags.sort()
  const availableYears = Array.from(new Set(projects.map(p => new Date(p.date).getFullYear()))) as number[]
  availableYears.sort((a, b) => b - a)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const ProjectSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{t.projects.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === 'ja' 
              ? '主にハプティクス（触覚）、バーチャルリアリティなどに関するプロジェクトなどに取り組んでいます'
              : 'We are mainly working on projects related to haptics (tactile sensation), virtual reality, and so on.'
            }
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto">
          <ProjectFilters
            locale={locale}
            availableTags={availableTags}
            availableYears={availableYears}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="text-center text-muted-foreground">
            {locale === 'ja' 
              ? `${localeProjects.length}件のプロジェクトが見つかりました`
              : `Found ${localeProjects.length} project${localeProjects.length !== 1 ? 's' : ''}`
            }
          </div>
        )}

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProjectSkeleton key={i} />
              ))}
            </div>
          ) : currentProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="transition-transform hover:scale-105"
                >
                  <ProjectCard 
                    project={project} 
                    locale={locale}
                    onClick={() => onNavigate('project-detail', project.slug)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="text-6xl opacity-50">🔍</div>
                <h3 className="text-xl font-semibold">
                  {locale === 'ja' ? 'プロジェクトが見つかりません' : 'No projects found'}
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