'use client'

import { useState, type FormEvent } from 'react'
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

interface NewsFiltersProps {
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

export function NewsFilters({ locale, availableTags, availableYears, filters, onFiltersChange }: NewsFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.q)

  const t = getTranslations(locale)

  const updateFilters = (updates: Partial<{ tag: string; year: string; q: string }>) => {
    onFiltersChange({
      ...filters,
      ...updates,
    })
  }

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateFilters({ q: searchQuery })
  }

  const clearFilters = () => {
    setSearchQuery('')
    onFiltersChange({ tag: '', year: '', q: '' })
  }

  const activeFiltersCount = [filters.tag, filters.year, filters.q].filter(Boolean).length

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          type="text"
          placeholder={t.news.filters.search}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="pl-10 pr-4"
        />
      </form>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1">
          <Select value={filters.tag || undefined} onValueChange={(value) => updateFilters({ tag: value || '' })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t.news.filters.tag} />
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

        <div className="flex items-center gap-1">
          <Select value={filters.year || undefined} onValueChange={(value) => updateFilters({ year: value || '' })}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t.news.filters.year} />
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

        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={clearFilters} size="sm">
            <X className="mr-2 h-4 w-4" />
            {t.news.filters.clear} ({activeFiltersCount})
          </Button>
        )}
      </div>

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
