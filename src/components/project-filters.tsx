'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Locale } from '../lib/types'
import { getTranslations } from '../lib/i18n'

interface ProjectFiltersProps {
  locale: Locale
  availableTags: string[]
  availableYears: number[]
  filters: {
    tag: string
    year: string
    q: string
  }
  onFiltersChange: (filters: { tag: string; year: string; q: string }) => void
}

export function ProjectFilters({ locale, availableTags, availableYears, filters, onFiltersChange }: ProjectFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.q)
  
  const t = getTranslations(locale)

  const updateFilters = (updates: Partial<{ tag: string; year: string; q: string }>) => {
    onFiltersChange({
      ...filters,
      ...updates
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ q: searchQuery })
  }

  const clearFilters = () => {
    setSearchQuery('')
    onFiltersChange({ tag: '', year: '', q: '' })
  }

  const activeFiltersCount = [filters.tag, filters.year, filters.q].filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={t.projects.filters.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
      </form>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3">
        {/* Tag Filter */}
        <div className="flex items-center gap-1">
          <Select value={filters.tag || undefined} onValueChange={(value) => updateFilters({ tag: value || '' })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t.projects.filters.tag} />
            </SelectTrigger>
            <SelectContent>
              {availableTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.tag && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateFilters({ tag: '' })}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-1">
          <Select value={filters.year || undefined} onValueChange={(value) => updateFilters({ year: value || '' })}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t.projects.filters.year} />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.year && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateFilters({ year: '' })}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Clear All Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={clearFilters} size="sm">
            <X className="mr-2 h-4 w-4" />
            {t.projects.filters.clear} ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.tag && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.tag}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => updateFilters({ tag: '' })}
              />
            </Badge>
          )}
          {filters.year && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.year}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => updateFilters({ year: '' })}
              />
            </Badge>
          )}
          {filters.q && (
            <Badge variant="secondary" className="flex items-center gap-1">
              "{filters.q}"
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => updateFilters({ q: '' })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}