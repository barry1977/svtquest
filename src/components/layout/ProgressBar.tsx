import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

type Props = {
  percent: number
  stars: number
  encouragement: string
}

export function ProgressBar({ percent, stars, encouragement }: Props) {
  return (
    <div className="glass-panel rounded-2xl px-3 py-3 shadow-lg sm:px-4">
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-sm font-700 text-ink">Progression du chapitre</p>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.min(5, Math.floor(stars / 2))
                  ? 'fill-tangerine text-tangerine'
                  : 'text-slate-300'
              }
            />
          ))}
          <span className="ml-1 text-xs font-700 text-ink-soft">{stars} ✦</span>
        </div>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-mint to-sky"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>
      <p className="mt-2 text-xs font-600 leading-snug text-mint-dark">{encouragement}</p>
    </div>
  )
}
