import { useCallback, useMemo, useState } from 'react'
import type { AppSection } from '@/types/course'

const SECTIONS: AppSection[] = [
  'summary',
  'mindmap',
  'schemas',
  'lab',
  'games',
  'quiz',
]

export function useProgress() {
  const [visited, setVisited] = useState<Set<AppSection>>(new Set(['summary']))
  const [stars, setStars] = useState(0)

  const markVisited = useCallback((section: AppSection) => {
    setVisited((prev) => {
      if (prev.has(section)) return prev
      const next = new Set(prev)
      next.add(section)
      return next
    })
  }, [])

  const addStars = useCallback((n: number) => {
    setStars((s) => Math.min(18, s + n))
  }, [])

  const progressPercent = useMemo(
    () => Math.round((visited.size / SECTIONS.length) * 100),
    [visited],
  )

  const encouragement = useMemo(() => {
    if (progressPercent >= 100 && stars >= 8) {
      return 'Tu es fin prête pour ton contrôle !'
    }
    if (progressPercent >= 80) return 'Encore un petit effort, tu y es presque !'
    if (progressPercent >= 40) return 'Belle progression, continue comme ça !'
    return 'Commence par le résumé, puis explore chaque activité. Courage !'
  }, [progressPercent, stars])

  return {
    visited,
    stars,
    progressPercent,
    encouragement,
    markVisited,
    addStars,
  }
}
