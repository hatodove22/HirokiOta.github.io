'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from './components/ui/sonner'
import { Header } from './components/header'
import { Footer } from './components/footer'
import { HomePage } from './pages/home-page'
import { AboutPage } from './pages/about-page'
import { ProjectsPage } from './pages/projects-page'
import { ProjectDetailPage } from './pages/project-detail-page'
import { PapersPage } from './pages/papers-page'
import { BlogsPage } from './pages/blogs-page'
import { BlogDetailPage } from './pages/blog-detail-page'
import { ContactPage } from './pages/contact-page'
import { Locale, defaultLocale } from './lib/types'

export default function App() {
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale)
  const [currentPage, setCurrentPage] = useState('home')
  const [currentSlug, setCurrentSlug] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigate = (page: string, slug?: string) => {
    setCurrentPage(page)
    if (slug) {
      setCurrentSlug(slug)
    } else {
      setCurrentSlug(null)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage locale={currentLocale} onNavigate={navigate} />
      case 'about':
        return <AboutPage locale={currentLocale} />
      case 'projects':
        return <ProjectsPage locale={currentLocale} onNavigate={navigate} />
      case 'project-detail':
        return <ProjectDetailPage locale={currentLocale} slug={currentSlug!} onNavigate={navigate} />
      case 'papers':
        return <PapersPage locale={currentLocale} />
      case 'blog':
        return <BlogsPage locale={currentLocale} onNavigate={navigate} />
      case 'blog-detail':
        return <BlogDetailPage locale={currentLocale} slug={currentSlug!} onNavigate={navigate} />
      case 'contact':
        return <ContactPage locale={currentLocale} />
      default:
        return <HomePage locale={currentLocale} onNavigate={navigate} />
    }
  }

  if (!mounted) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          locale={currentLocale}
          currentPage={currentPage}
          onNavigate={navigate}
          onLocaleChange={setCurrentLocale}
        />

        <main className="flex-1">
          {renderPage()}
        </main>

        <Footer locale={currentLocale} onNavigate={navigate} />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
