import React, { useState, useEffect } from 'react'
import { Mail, MapPin, Clock, Copy } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Locale } from '../lib/types'
import { getTranslations } from '../lib/i18n'
 

interface ContactPageProps {
  locale: Locale
}

export function ContactPage({ locale }: ContactPageProps) {
  const [copied, setCopied] = useState(false)

  const t = getTranslations(locale)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const emailAddress = 'ota.hioki.oc6@is.naist.jp'

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{t.contact.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.contact.description}
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            {/* Contact Information only */}
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    {locale === 'ja' ? '連絡先' : 'Contact Info'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <p>{emailAddress}</p>
                      <button
                        onClick={copyEmail}
                        aria-label={locale === 'ja' ? 'メールアドレスをコピー' : 'Copy email address'}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-md border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    {copied && (
                      <p className="text-xs text-muted-foreground">{locale === 'ja' ? 'コピーしました' : 'Copied!'}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {locale === 'ja' ? '所在地' : 'Location'}
                    </p>
                    <p>
                      {locale === 'ja' 
                        ? '〒630-0192\n奈良県生駒市高山町8916番地-5 情報科学棟 B315\n近鉄けいはんな線 学研北生駒駅から徒歩20分、バス5分'
                        : '8916-5 Takayama-cho, Ikoma, Nara 630-0192, Information Science Bldg. B315'
                      }
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {locale === 'ja' ? '返信時間' : 'Response Time'}
                    </p>
                    <p className="text-sm">
                      {locale === 'ja' 
                        ? '通常24-48時間以内'
                        : 'Usually within 24-48 hours'
                      }
                    </p>
                  </div>
                </CardContent>
            </Card>

            {/* Contact Form removed as requested */}
          </div>

          {/* Additional Resources removed as requested */}
        </div>
      </div>
    </div>
  )
}