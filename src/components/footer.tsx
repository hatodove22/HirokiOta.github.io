import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Locale } from '../lib/types'
import { getTranslations } from '../lib/i18n'
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip'
import logoLight from '../assets/logo_light.svg'
import logoDark from '../assets/logo_dark.svg'
import githubIcon from '../assets/icon/GitHub.svg'
import xIcon from '../assets/icon/X.svg'
import linkedinIcon from '../assets/icon/LinkedIn.svg'
import googleScholarIcon from '../assets/icon/GoogleScholar.svg'
import orcidIcon from '../assets/icon/ORCiD.svg'

interface FooterProps {
  locale: Locale
  onNavigate: (page: string) => void
}

function FooterSocialLink({ href, label, iconSrc }: {
  href: string;
  label: string;
  iconSrc: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-[30px] items-center justify-center text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
        >
          <span className="sr-only">{label}</span>
          <img 
            src={iconSrc} 
            alt={label}
            className="h-full w-full object-contain"
            style={{ width: '18px', height: '18px' }}
          />
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function Footer({ locale, onNavigate }: FooterProps) {
  const t = getTranslations(locale)
  const [emailCopied, setEmailCopied] = useState(false)

  const email = 'ota.hioki.oc6@is.naist.jp'
  const addressParts = locale === 'ja' 
    ? {
        postalCode: '〒630-0192',
        address: '奈良県生駒市高山町8916番地-5 情報科学棟 B315'
      }
    : {
        postalCode: '8916-5',
        address: 'Takayama-cho, Ikoma-shi, Nara 630-0192, Japan, Information Science Building B315'
      }

  const handleEmailClick = () => {
    navigator.clipboard.writeText(email)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center transition-opacity hover:opacity-90"
            >
              <span className="sr-only">{t.about.profile.name}</span>
              <img src={logoLight} alt={t.about.profile.name} className="h-16 w-auto dark:hidden" />
              <img src={logoDark} alt={t.about.profile.name} className="hidden h-16 w-auto dark:block" />
            </button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <FooterSocialLink 
              href="https://github.com/hatodove22" 
              label="GitHub" 
              iconSrc={githubIcon} 
            />
            <FooterSocialLink 
              href="https://x.com/troll01234" 
              label="X (Twitter)" 
              iconSrc={xIcon} 
            />
            <FooterSocialLink 
              href="https://www.linkedin.com/in/hiroki-ota-54a11119b/" 
              label="LinkedIn" 
              iconSrc={linkedinIcon} 
            />
            <FooterSocialLink 
              href="https://scholar.google.co.kr/citations?user=zhDHaR4AAAAJ&hl" 
              label="Google Scholar" 
              iconSrc={googleScholarIcon} 
            />
            <FooterSocialLink 
              href="https://orcid.org/0009-0003-5546-921X" 
              label="ORCID" 
              iconSrc={orcidIcon} 
            />
          </div>

          {/* Contact Information */}
          <div className="flex flex-col items-center gap-3 text-base text-muted-foreground">
            {/* Address */}
            <div className="text-center">
              <div>{addressParts.postalCode}</div>
              <div>{addressParts.address}</div>
            </div>
            {/* Email */}
            <button
              onClick={handleEmailClick}
              className="flex items-center gap-2 text-base hover:text-foreground transition-colors underline"
              title={locale === 'ja' ? 'クリックしてコピー' : 'Click to copy'}
            >
              <span className="text-base">{email}</span>
              {emailCopied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}