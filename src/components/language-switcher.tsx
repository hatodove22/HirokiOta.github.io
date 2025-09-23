'use client'

import { Globe } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Locale, locales } from '../lib/types'

interface LanguageSwitcherProps {
  currentLocale: Locale
  onLocaleChange: (locale: Locale) => void
}

export function LanguageSwitcher({ currentLocale, onLocaleChange }: LanguageSwitcherProps) {
  const switchLanguage = (newLocale: Locale) => {
    onLocaleChange(newLocale)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          {currentLocale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLanguage(locale)}
            className={locale === currentLocale ? 'bg-accent' : ''}
          >
            {locale === 'ja' ? '日本語' : 'English'}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}