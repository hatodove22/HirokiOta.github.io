import { Github, Mail, ExternalLink, Award, BookOpen } from 'lucide-react'
import { Locale } from '../lib/types'
import { getTranslations } from '../lib/i18n'

interface FooterProps {
  locale: Locale
  onNavigate: (page: string) => void
}

const socialLinks = [
  {
    name: 'Email',
    href: 'mailto:taro.yamada@example.edu',
    icon: Mail,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/example',
    icon: Github,
  },
  {
    name: 'Google Scholar',
    href: 'https://scholar.google.com/citations?user=example',
    icon: Award,
  },
  {
    name: 'ORCID',
    href: 'https://orcid.org/0000-0000-0000-0000',
    icon: BookOpen,
  },
]

export function Footer({ locale, onNavigate }: FooterProps) {
  const t = getTranslations(locale)
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {currentYear} {t.about.profile.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}