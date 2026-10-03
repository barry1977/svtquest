import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { FoodCategory, SortGameItem } from '@/types/course'
import { celebrateSuccess } from '@/lib/confetti'

const BINS: { id: FoodCategory; label: string; emoji: string; color: string }[] = [
  { id: 'batisseur', label: 'Bâtisseurs', emoji: '🧱', color: '#8B5CF6' },
  { id: 'energetique', label: 'Énergétiques', emoji: '⚡', color: '#F97316' },
  { id: 'fonctionnel', label: 'Fonctionnels', emoji: '🛡️', color: '#10B981' },
]

type Props = {
  title: string
  description: string
  items: SortGameItem[]
  onStar?: () => void
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function SortGame({ title, description, items, onStar }: Props) {
  const deck = useMemo(() => shuffle(items), [items])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [flash, setFlash] = useState<'ok' | 'ko' | null>(null)
  const [done, setDone] = useState(false)

  const current = deck[index]

  const drop = (category: FoodCategory) => {
    if (!current || done) return
    const correct = current.category === category
    if (correct) {
      setScore((s) => s + 1)
      setFlash('ok')
      setMessage(`Oui ! ${current.emoji} ${current.name} est bien un aliment ${BINS.find((b) => b.id === category)?.label.toLowerCase()}.`)
      celebrateSuccess()
      onStar?.()
    } else {
      setFlash('ko')
      setMessage(current.hint)
    }

    setTimeout(() => {
      setFlash(null)
      if (index + 1 >= deck.length) {
        setDone(true)
      } else {
        setIndex((i) => i + 1)
        setMessage(null)
      }
    }, 1100)
  }

  const reset = () => {
    setIndex(0)
    setScore(0)
    setMessage(null)
    setDone(false)
    setFlash(null)
  }

  return (
    <div className="space-y-4 rounded-2xl border-2 border-tangerine/20 bg-white p-4 shadow-lg sm:p-5">
      <div>
        <h3 className="text-lg font-800 text-ink">{title}</h3>
        <p className="text-sm text-ink-soft">{description}</p>
      </div>

      {!done && current && (
        <>
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ y: -80, opacity: 0, rotate: -8 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  rotate: 0,
                  scale: flash === 'ok' ? 1.08 : flash === 'ko' ? 0.95 : 1,
                }}
                exit={{ y: 60, opacity: 0 }}
                className="flex h-36 w-36 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-tangerine-light to-white shadow-lg"
              >
                <span className="text-5xl">{current.emoji}</span>
                <span className="mt-2 font-800">{current.name}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="text-center text-xs font-700 text-ink-soft">
            Carte {index + 1} / {deck.length} — Score {score}
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
            {BINS.map((bin) => (
              <button
                key={bin.id}
                type="button"
                onClick={() => drop(bin.id)}
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-800 text-white shadow-md transition hover:brightness-110 sm:flex-col sm:py-4"
                style={{ backgroundColor: bin.color }}
              >
                <span className="text-2xl">{bin.emoji}</span>
                <span className="sm:mt-1">{bin.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {message && (
        <p
          className={`rounded-xl px-3 py-2 text-sm font-700 ${
            flash === 'ko' ? 'bg-tangerine-light text-tangerine-dark' : 'bg-mint-light text-mint-dark'
          }`}
        >
          {message}
        </p>
      )}

      {done && (
        <div className="rounded-2xl bg-mint-light p-4 text-center">
          <p className="text-lg font-800 text-mint-dark">
            Terminé ! {score}/{deck.length} bonnes réponses
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 rounded-xl bg-mint px-4 py-2 text-sm font-800 text-white"
          >
            Rejouer
          </button>
        </div>
      )}
    </div>
  )
}
