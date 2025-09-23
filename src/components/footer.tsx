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
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <span className="sr-only">{link.name}</span>
                  <Icon className="h-5 w-5" />
                </a>
              )
            })}
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {currentYear} {t.about.profile.name}. All rights reserved.
            </p>
          </div>

          {/* Additional Links */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              {t.nav.contact}
            </button>
            <span>•</span>
            <a
              href="/cv.pdf"
              className="hover:text-primary transition-colors inline-flex items-center cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.common.download} CV
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}