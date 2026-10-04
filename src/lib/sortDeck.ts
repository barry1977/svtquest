import type { FoodCategory, SortGameItem } from '@/types/course'

const CATEGORIES: FoodCategory[] = ['batisseur', 'energetique', 'fonctionnel']

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Tire un tour équilibré depuis un grand pool, en évitant les aliments récents.
 */
export function pickSortRound(
  pool: SortGameItem[],
  count = 9,
  recentNames: string[] = [],
): SortGameItem[] {
  if (pool.length === 0) return []

  const target = Math.min(count, pool.length)
  const recent = new Set(recentNames.map((n) => n.toLowerCase()))
  const perCat = Math.max(1, Math.floor(target / CATEGORIES.length))
  const picked: SortGameItem[] = []
  const usedIds = new Set<string>()

  const pushUnique = (item: SortGameItem) => {
    if (usedIds.has(item.id) || picked.length >= target) return
    picked.push(item)
    usedIds.add(item.id)
  }

  // 1) équilibré en évitant les récents
  for (const cat of CATEGORIES) {
    const candidates = shuffle(
      pool.filter(
        (p) =>
          p.category === cat &&
          !usedIds.has(p.id) &&
          !recent.has(p.name.toLowerCase()),
      ),
    )
    for (const item of candidates.slice(0, perCat)) pushUnique(item)
  }

  // 2) compléter hors récents
  for (const item of shuffle(
    pool.filter((p) => !usedIds.has(p.id) && !recent.has(p.name.toLowerCase())),
  )) {
    pushUnique(item)
  }

  // 3) si nécessaire, réautoriser les récents
  for (const item of shuffle(pool.filter((p) => !usedIds.has(p.id)))) {
    pushUnique(item)
  }

  return shuffle(picked)
}
