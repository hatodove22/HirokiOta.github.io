import { Locale } from './types'

export const defaultLocale: Locale = 'ja'
export const locales: Locale[] = ['ja', 'en']

export interface Translations {
  nav: {
    home: string
    about: string
    projects: string
    papers: string
    news: string
    contact: string
  }
  home: {
    title: string
    subtitle: string
    description: string
    cta: {
      contact: string
      cv: string
    }
    sections: {
      highlights: string
      news: string
      papers: string
      contact: string
      pressKit: string
    }
  }
  about: {
    title: string
    profile: {
      name: string
      title: string
      affiliation: string
    }
    sections: {
      introduction: string
      profile: string
      capabilities: string
      interests: string
      goals: string
      awards: string
    }
  }
  projects: {
    title: string
    filters: {
      search: string
      tag: string
      year: string
      clear: string
    }
    card: {
      view: string
      demo: string
      repo: string
    }
  }
  news: {
    title: string
    description: string
    filters: {
      search: string
      tag: string
      year: string
      clear: string
    }
  }
  papers: {
    title: string
    filters: {
      year: string
      venue: string
      search: string
    }
    award: string
    categories: {
      scope: {
        国内: string
        国際: string
        学位論文: string
      }
      type: {
        ジャーナル: string
        会議: string
        ワークショップ: string
      }
      peerReview: {
        査読付き: string
        査読なし: string
      }
    }
  }
  contact: {
    title: string
    description: string
    form: {
      name: string
      affiliation: string
      email: string
      purpose: string
      message: string
      submit: string
      purposes: {
        research: string
        hiring: string
        media: string
        other: string
      }
    }
    success: string
    error: string
  }
  common: {
    loading: string
    error: string
    notFound: string
    backTo: string
    readMore: string
    external: string
    download: string
    close: string
    light: string
    dark: string
    system: string
  }
}

export const translations: Record<Locale, Translations> = {
  ja: {
    nav: {
      home: 'ホーム',
      about: '私について',
      projects: 'プロジェクト',
      papers: '論文',
      news: 'ニュース',
      contact: 'お問い合わせ'
    },
    home: {
      title: '博士課程学生',
      subtitle: '機械学習・データサイエンス研究者',
      description: '私は奈良先端科学技術大学院大学（NAIST）の博士課程学生です。触覚技術、ロボティクス、バーチャルリアリティの研究に従事しています。特に、人間の触覚的形状認知特性に着目したハンドヘルド型形状提示装置「FresnelShape」の開発と評価を行っています。VR環境における触覚体験の向上を目指しています。',
      cta: {
        contact: 'お問い合わせ',
        cv: '履歴書ダウンロード'
      },
      sections: {
        highlights: '注目プロジェクト',
        news: 'ニュース',
        papers: '発表論文',
        contact: 'お問い合わせ',
        pressKit: 'プレスキット'
      }
    },
    about: {
      title: 'About Me',
      profile: {
        name: '太田裕紀',
        title: '博士課程学生',
        affiliation: '奈良先端科学技術大学院大学　サイバネティクスリアリティ工学研究室'
      },
      sections: {
        introduction: '自己紹介',
        profile: 'プロフィール',
        capabilities: '私にできること',
        interests: '主な興味関心',
        goals: 'これからの目標',
        awards: '受賞歴'
      }
    },
    projects: {
      title: 'プロジェクト',
      filters: {
        search: '検索',
        tag: 'タグ',
        year: '年',
        clear: 'クリア'
      },
      card: {
        view: '詳細を見る',
        demo: 'デモ',
        repo: 'リポジトリ'
      }
    },
    news: {
      title: 'ニュース',
      description: '研究の気づきやイベントレポートなどをお届けします。',
      filters: {
        search: '検索',
        tag: 'カテゴリ',
        year: '年',
        clear: 'リセット'
      }
    },
    papers: {
      title: '論文',
      filters: {
        year: '年',
        venue: '会議・ジャーナル',
        search: '検索'
      },
      award: '受賞',
      categories: {
        scope: {
          国内: '国内',
          国際: '国際',
          学位論文: '学位論文'
        },
        type: {
          ジャーナル: 'ジャーナル',
          会議: '会議',
          ワークショップ: 'ワークショップ'
        },
        peerReview: {
          査読付き: '査読付き',
          査読なし: '査読なし'
        }
      }
    },
    contact: {
      title: 'お問い合わせ',
      description: '研究に関するご質問、共同研究、採用に関するお問い合わせをお待ちしております。',
      form: {
        name: 'お名前',
        affiliation: '所属',
        email: 'メールアドレス',
        purpose: 'お問い合わせの目的',
        message: 'メッセージ',
        submit: '送信',
        purposes: {
          research: '研究・共同研究',
          hiring: '採用・求人',
          media: 'メディア・取材',
          other: 'その他'
        }
      },
      success: 'メッセージを送信しました。',
      error: '送信に失敗しました。再度お試しください。'
    },
    common: {
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      notFound: 'ページが見つかりません',
      backTo: '戻る',
      readMore: '続きを読む',
      external: '外部リンク',
      download: 'ダウンロード',
      close: '閉じる',
      light: 'ライト',
      dark: 'ダーク',
      system: 'システム'
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      papers: 'Papers',
      news: 'News',
      contact: 'Contact'
    },
    home: {
      title: 'PhD Student',
      subtitle: 'Machine Learning & Data Science Researcher',
      description: 'I am a Ph.D. student at the Nara Institute of Science and Technology (NAIST). I am engaged in research on haptic technology, robotics, and virtual reality. Specifically, I am developing and evaluating “FresnelShape,” a handheld shape display device focusing on human tactile shape perception characteristics. I aim to enhance tactile experiences in VR environments.',
      cta: {
        contact: 'Contact',
        cv: 'Download CV'
      },
      sections: {
        highlights: 'Featured Projects',
        news: 'Latest News',
        papers: 'Recent Publications',
        contact: 'Get in Touch',
        pressKit: 'Press Kit'
      }
    },
    about: {
      title: 'About',
      profile: {
        name: 'Ota Hiroki',
        title: 'PhD Student',
        affiliation: 'Nara Institute of Science and Technology, Cybernetics Reality Engineering Laboratory'
      },
      sections: {
        introduction: 'Introduction',
        profile: 'Profile',
        capabilities: 'What I Can Do',
        interests: 'Key Interests',
        goals: 'Future Goals',
        awards: 'Awards'
      }
    },
    projects: {
      title: 'Projects',
      filters: {
        search: 'Search',
        tag: 'Tag',
        year: 'Year',
        clear: 'Clear'
      },
      card: {
        view: 'View Details',
        demo: 'Demo',
        repo: 'Repository'
      }
    },
    news: {
      title: 'News',
      description: 'Insights on research progress, events, and behind-the-scenes updates.',
      filters: {
        search: 'Search',
        tag: 'Category',
        year: 'Year',
        clear: 'Clear'
      }
    },
    papers: {
      title: 'Papers',
      filters: {
        year: 'Year',
        venue: 'Venue',
        search: 'Search'
      },
      award: 'Award',
      categories: {
        scope: {
          国内: 'Domestic',
          国際: 'International',
          学位論文: 'Dissertation'
        },
        type: {
          ジャーナル: 'Journal',
          会議: 'Conference',
          ワークショップ: 'Workshop'
        },
        peerReview: {
          査読付き: 'Peer-reviewed',
          査読なし: 'Non-peer-reviewed'
        }
      }
    },
    contact: {
      title: 'Contact',
      description: 'I welcome inquiries about research, collaboration opportunities, and career opportunities.',
      form: {
        name: 'Name',
        affiliation: 'Affiliation',
        email: 'Email',
        purpose: 'Purpose',
        message: 'Message',
        submit: 'Send',
        purposes: {
          research: 'Research & Collaboration',
          hiring: 'Hiring & Jobs',
          media: 'Media & Press',
          other: 'Other'
        }
      },
      success: 'Message sent successfully.',
      error: 'Failed to send message. Please try again.'
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      notFound: 'Page not found',
      backTo: 'Back to',
      readMore: 'Read more',
      external: 'External link',
      download: 'Download',
      close: 'Close',
      light: 'Light',
      dark: 'Dark',
      system: 'System'
    }
  }
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations[defaultLocale]
}
