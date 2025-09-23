'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Locale } from '../lib/types'
import { getTranslations } from '../lib/i18n'

interface ThemeToggleProps {
  locale: Locale
}

export function ThemeToggle({ locale }: ThemeToggleProps) {
  const { setTheme } = useTheme()
  const t = getTranslations(locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          {t.common.light}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          {t.common.dark}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          {t.common.system}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}