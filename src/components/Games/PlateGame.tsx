import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { PlateIngredient } from '@/types/course'
import { celebrateStars } from '@/lib/confetti'

type Props = {
  title: string
  description: string
  ingredients: PlateIngredient[]
  tips: string[]
  onStar?: () => void
}

export function PlateGame({
  title,
  description,
  ingredients,
  tips,
  onStar,
}: Props) {
  const [plate, setPlate] = useState<PlateIngredient[]>([])

  const stats = useMemo(() => {
    const cats = {
      batisseur: plate.some((p) => p.category === 'batisseur'),
      energetique: plate.some((p) => p.category === 'energetique'),
      fonctionnel: plate.some((p) => p.category === 'fonctionnel'),
    }
    const points = plate.reduce((sum, p) => sum + p.points, 0)
    const junk = plate.filter((p) => p.points === 0).length
    const balance = [cats.batisseur, cats.energetique, cats.fonctionnel].filter(Boolean).length
    const score = Math.min(20, points * 2 + balance * 2 - junk * 3)
    return { cats, points, junk, balance, score: Math.max(0, score) }
  }, [plate])

  const tip = useMemo(() => {
    if (plate.length === 0) return 'Glisse des aliments dans ton assiette pour commencer.'
    if (stats.junk > 0 && stats.balance < 3) return tips[3]
    if (!stats.cats.fonctionnel) return tips[0]
    if (!stats.cats.batisseur) return tips[1]
    if (!stats.cats.energetique) return tips[2]
    if (stats.balance === 3 && stats.junk === 0) return tips[4]
    return tips[0]
  }, [plate.length, stats, tips])

  const add = (item: PlateIngredient) => {
    if (plate.find((p) => p.id === item.id) || plate.length >= 6) return
    const next = [...plate, item]
    setPlate(next)
    const nextBalance = ['batisseur', 'energetique', 'fonctionnel'].filter((c) =>
      next.some((p) => p.category === c),
    ).length
    if (nextBalance === 3 && next.every((p) => p.points > 0)) {
      celebrateStars()
      onStar?.()
    }
  }

  const remove = (id: string) => {
    setPlate((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-4 rounded-2xl border-2 border-mint/20 bg-white p-4 shadow-lg sm:p-5">
      <div>
        <h3 className="text-lg font-800 text-ink">{title}</h3>
        <p className="text-sm text-ink-soft">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-800 uppercase text-ink-soft">Ingrédients</p>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing) => {
              const used = plate.some((p) => p.id === ing.id)
              return (
                <button
                  key={ing.id}
                  type="button"
                  disabled={used}
                  onClick={() => add(ing)}
                  className={`rounded-2xl px-3 py-2 text-sm font-700 shadow-sm ${
                    used
                      ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                      : 'bg-mint-light text-ink hover:bg-mint hover:text-white'
                  }`}
                >
                  {ing.emoji} {ing.name}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-800 uppercase text-ink-soft">Ton assiette</p>
          <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-full border-8 border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-inner sm:h-56 sm:w-56">
            <div className="absolute inset-4 rounded-full border border-dashed border-slate-200" />
            <div className="relative z-10 flex max-w-[140px] flex-wrap items-center justify-center gap-2 sm:max-w-[160px]">
              {plate.length === 0 && (
                <span className="text-sm font-600 text-slate-400">Vide…</span>
              )}
              {plate.map((p) => (
                <motion.button
                  key={p.id}
                  type="button"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => remove(p.id)}
                  className="text-3xl"
                  title="Retirer"
                >
                  {p.emoji}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-sky-light/70 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-800 text-sky-dark">Jauge d&apos;équilibre</p>
          <p className="text-lg font-800 text-sky-dark">{stats.score}/20</p>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-mint via-sky to-violet-soft"
            animate={{ width: `${(stats.score / 20) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-700">
          <span className={stats.cats.batisseur ? 'text-violet-dark' : 'text-slate-400'}>
            🧱 Bâtisseur
          </span>
          <span className={stats.cats.energetique ? 'text-tangerine-dark' : 'text-slate-400'}>
            ⚡ Énergétique
          </span>
          <span className={stats.cats.fonctionnel ? 'text-mint-dark' : 'text-slate-400'}>
            🛡️ Fonctionnel
          </span>
        </div>
        <p className="mt-3 text-sm font-700 text-ink">{tip}</p>
      </div>
    </div>
  )
}
