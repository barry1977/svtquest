import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import type { Flashcard } from '@/types/course'

type Props = {
  cards: Flashcard[]
  onStar?: () => void
}

export function Flashcards({ cards, onStar }: Props) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seen, setSeen] = useState<Set<string>>(new Set())
  const card = cards[index]

  if (!card) return null

  const flip = () => {
    setFlipped((f) => !f)
    if (!seen.has(card.id)) {
      setSeen((prev) => new Set(prev).add(card.id))
      onStar?.()
    }
  }

  const go = (dir: -1 | 1) => {
    setFlipped(false)
    setIndex((i) => (i + dir + cards.length) % cards.length)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-800 text-ink">Flashcards vocabulaire</h3>
        <span className="text-xs font-700 text-ink-soft">
          {index + 1} / {cards.length}
        </span>
      </div>

      <div className="perspective-1000 mx-auto max-w-md">
        <button
          type="button"
          onClick={flip}
          className="relative h-56 w-full"
          style={{ perspective: 1000 }}
        >
          <motion.div
            className="relative h-full w-full"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.55, type: 'spring', stiffness: 120 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-6 shadow-lg"
              style={{
                backgroundColor: card.color,
                color: 'white',
                backfaceVisibility: 'hidden',
              }}
            >
              <p className="text-xs font-800 uppercase tracking-wide opacity-80">
                Terme clé
              </p>
              <p className="mt-2 text-center text-2xl font-800">{card.term}</p>
              <p className="mt-4 text-xs font-600 opacity-80">Clique pour retourner</p>
            </div>
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 bg-white p-6 shadow-lg"
              style={{
                borderColor: card.color,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <p className="text-xs font-800 uppercase" style={{ color: card.color }}>
                Définition
              </p>
              <p className="mt-3 text-center text-sm font-700 leading-relaxed text-ink">
                {card.definition}
              </p>
            </div>
          </motion.div>
        </button>
      </div>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          className="rounded-xl bg-white px-4 py-2 text-sm font-700 shadow-md hover:bg-mint-light"
        >
          ← Précédente
        </button>
        <button
          type="button"
          onClick={() => {
            setFlipped(false)
          }}
          className="rounded-xl bg-white p-2 shadow-md"
          aria-label="Remettre à plat"
        >
          <RotateCcw size={18} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="rounded-xl bg-white px-4 py-2 text-sm font-700 shadow-md hover:bg-mint-light"
        >
          Suivante →
        </button>
      </div>
    </div>
  )
}
