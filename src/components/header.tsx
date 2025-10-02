'use client'

import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { ThemeToggle } from './theme-toggle'
import { LanguageSwitcher } from './language-switcher'
import { Locale } from '../lib/types'
import { getTranslations } from '../lib/i18n'
import { cn } from '../lib/utils'
import logoLight from '../assets/logo_light.svg'
import logoDark from '../assets/logo_dark.svg'

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
    { name: t.nav.news, page: 'news' },
    { name: t.nav.contact, page: 'contact' },
  ]

  const isActive = (page: string) => currentPage === page

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2 transition-opacity hover:opacity-90"
        >
          <span className="sr-only">{t.about.profile.name}</span>
          <img src={logoLight} alt={t.about.profile.name} className="h-10 w-auto dark:hidden" />
          <img src={logoDark} alt={t.about.profile.name} className="hidden h-10 w-auto dark:block" />
        </button>

        <nav className="hidden items-center space-x-6 md:flex">
          {navigation.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={cn(
                'cursor-pointer text-sm font-medium transition-colors hover:text-primary',
                isActive(item.page) ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="hidden items-center space-x-2 md:flex">
          <LanguageSwitcher currentLocale={locale} onLocaleChange={onLocaleChange} />
          <ThemeToggle locale={locale} />
        </div>

        <div className="flex items-center space-x-2 md:hidden">
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
              <nav className="mt-8 flex flex-col space-y-4">
                {navigation.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => onNavigate(item.page)}
                    className={cn(
                      'cursor-pointer rounded-md px-2 py-1 text-left text-sm font-medium transition-colors hover:text-primary',
                      isActive(item.page) ? 'bg-accent text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
