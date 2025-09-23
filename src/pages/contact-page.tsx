import { useState } from 'react'
import { Send, Mail, MapPin, Clock } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { toast } from 'sonner@2.0.3'
import { Locale, ContactFormData } from '../lib/types'
import { getTranslations } from '../lib/i18n'
import { isValidEmail } from '../lib/utils'

interface ContactPageProps {
  locale: Locale
}

export function ContactPage({ locale }: ContactPageProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    affiliation: '',
    email: '',
    purpose: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const t = getTranslations(locale)

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error(locale === 'ja' ? 'お名前を入力してください' : 'Please enter your name')
      return false
    }
    
    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      toast.error(locale === 'ja' ? '有効なメールアドレスを入力してください' : 'Please enter a valid email address')
      return false
    }
    
    if (!formData.purpose) {
      toast.error(locale === 'ja' ? 'お問い合わせの目的を選択してください' : 'Please select the purpose of your inquiry')
      return false
    }
    
    if (!formData.message.trim()) {
      toast.error(locale === 'ja' ? 'メッセージを入力してください' : 'Please enter your message')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real application, you would send this to your API
      console.log('Form submitted:', formData)
      
      toast.success(t.contact.success)
      
      // Reset form
      setFormData({
        name: '',
        affiliation: '',
        email: '',
        purpose: '',
        message: ''
      })
    } catch (error) {
      console.error('Failed to submit form:', error)
      toast.error(t.contact.error)
    } finally {
      setIsSubmitting(false)
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
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
                    <p>taro.yamada@example.edu</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {locale === 'ja' ? '所在地' : 'Location'}
                    </p>
                    <p>
                      {locale === 'ja' 
                        ? '〒100-0001 東京都千代田区'
                        : 'Tokyo, Japan'
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

              {/* Additional Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">
                      {locale === 'ja' ? 'お問い合わせについて' : 'About Inquiries'}
                    </h3>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>
                        {locale === 'ja'
                          ? '• 研究に関するご質問やコラボレーションのご提案'
                          : '• Research questions and collaboration proposals'
                        }
                      </p>
                      <p>
                        {locale === 'ja'
                          ? '• 採用・キャリアに関するお問い合わせ'
                          : '• Career and hiring inquiries'
                        }
                      </p>
                      <p>
                        {locale === 'ja'
                          ? '• メディア・取材のご依頼'
                          : '• Media and interview requests'
                        }
                      </p>
                      <p>
                        {locale === 'ja'
                          ? '• その他のご質問・ご相談'
                          : '• Other questions and consultations'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {locale === 'ja' ? 'お問い合わせフォーム' : 'Contact Form'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t.contact.form.name} *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="affiliation">{t.contact.form.affiliation}</Label>
                        <Input
                          id="affiliation"
                          type="text"
                          value={formData.affiliation}
                          onChange={(e) => handleInputChange('affiliation', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t.contact.form.email} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">{t.contact.form.purpose} *</Label>
                      <Select value={formData.purpose} onValueChange={(value) => handleInputChange('purpose', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t.contact.form.purpose} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="research">{t.contact.form.purposes.research}</SelectItem>
                          <SelectItem value="hiring">{t.contact.form.purposes.hiring}</SelectItem>
                          <SelectItem value="media">{t.contact.form.purposes.media}</SelectItem>
                          <SelectItem value="other">{t.contact.form.purposes.other}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t.contact.form.message} *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder={locale === 'ja' 
                          ? 'お問い合わせ内容をご記入ください...'
                          : 'Please describe your inquiry...'
                        }
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          {locale === 'ja' ? '送信中...' : 'Sending...'}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t.contact.form.submit}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground">
                      {locale === 'ja'
                        ? '* は必須項目です。送信いただいた情報は適切に管理し、お問い合わせへの回答にのみ使用いたします。'
                        : '* Required fields. The information you provide will be handled appropriately and used only to respond to your inquiry.'
                      }
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="text-center pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">
              {locale === 'ja' ? 'その他のリソース' : 'Additional Resources'}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" asChild>
                <a href="/cv.pdf" target="_blank" rel="noopener noreferrer">
                  CV {t.common.download}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer">
                  Google Scholar
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://orcid.org" target="_blank" rel="noopener noreferrer">
                  ORCID
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}