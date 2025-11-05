import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
}

export function formatDateJa(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long'
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// ニュース記事のIDやslugから一貫性のあるランダムな絵文字を生成
export function getRandomEmojiForNews(idOrSlug: string): string {
  // ニュース関連の絵文字リスト（重複なし、ニュース・研究・技術関連）
  const emojis = [
    '📰', '📝', '📄', '📋', '📑', '📊', '📈', '📉', '📌', '📍',
    '🔍', '💡', '🎯', '🚀', '⭐', '✨', '🌟', '💫', '🔥', '💎',
    '🎨', '🎭', '🎪', '🎬', '🎮', '🎲',
    '📚', '📖', '📗', '📘', '📙', '📕', '📓', '📔', '📒', '📃',
    '🔬', '🔭', '⚗️', '🧪', '🧬',
    '💻', '📱', '⌚', '💾', '💿', '📀', '🖥️', '⌨️', '🖱️', '🖨️',
    '🌐', '🌍', '🌎', '🌏', '🗺️', '🧭',
    '⛰️', '🏔️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️',
    '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤',
    '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯',
    '🏰', '💒', '🗼', '🗽',
  ]
  
  // IDやslugからハッシュ値を生成して一貫性のあるランダムなインデックスを取得
  let hash = 0
  for (let i = 0; i < idOrSlug.length; i++) {
    const char = idOrSlug.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  // 絶対値を使ってインデックスを取得
  const index = Math.abs(hash) % emojis.length
  return emojis[index]
}