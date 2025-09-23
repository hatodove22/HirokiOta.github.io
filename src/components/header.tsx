'use client'

import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { ThemeToggle } from './theme-toggle'
import { LanguageSwitcher } from './language-switcher'
import { Locale } from '../lib/types'
import { getTranslations } from '../lib/i18n'
import { cn } from '../lib/utils'

interface HeaderProps {
  locale: Locale
  currentPage: string
  onNavigate: (page: string, slug?: string) => void
  onLocaleChange: (locale: Locale) => void
}

export function Header({ locale, currentPage, onNavigate, onLocaleChange }: HeaderProps) {
  const t = getTranslations(locale)

  const navigation = [
    { name: t.nav.home, page: 'home' },
    { name: t.nav.about, page: 'about' },
    { name: t.nav.projects, page: 'projects' },
    { name: t.nav.papers, page: 'papers' },
    { name: t.nav.contact, page: 'contact' },
  ]

  const isActive = (page: string) => {
    return currentPage === page
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => onNavigate('home')} 
          className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer"
        >
          {t.about.profile.name}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary cursor-pointer',
                isActive(item.page)
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <LanguageSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />
          <ThemeToggle locale={locale} />
          <Button onClick={() => onNavigate('contact')}>
            {t.nav.contact}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-2">
          <LanguageSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />
          <ThemeToggle locale={locale} />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{t.about.profile.name}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => onNavigate(item.page)}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-primary px-2 py-1 rounded-md text-left cursor-pointer',
                      isActive(item.page)
                        ? 'text-primary bg-accent'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.name}
                  </button>
                ))}
                <Button onClick={() => onNavigate('contact')} className="mt-4">
                  {t.nav.contact}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}