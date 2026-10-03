import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SchemaDefinition } from '@/types/course'

type Props = {
  schema: SchemaDefinition
}

export function PyramidSchema({ schema }: Props) {
  const tiers = schema.tiers ?? []
  const [activeId, setActiveId] = useState(tiers[tiers.length - 1]?.id ?? null)
  const active = tiers.find((t) => t.id === activeId)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col items-center rounded-2xl border-2 border-mint/20 bg-white/80 p-4 shadow-lg sm:p-6">
          {tiers.map((tier, index) => {
            const widthPercent = 42 + index * 8
            const isActive = activeId === tier.id
            return (
              <motion.button
                key={tier.id}
                type="button"
                onMouseEnter={() => setActiveId(tier.id)}
                onFocus={() => setActiveId(tier.id)}
                onClick={() => setActiveId(tier.id)}
                animate={{
                  scale: isActive ? 1.04 : 1,
                  width: `${widthPercent}%`,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                className="relative my-1 min-w-[140px] rounded-xl px-2 py-2.5 text-center text-xs font-800 text-white shadow-md sm:min-w-[160px] sm:px-3 sm:py-3 sm:text-sm"
                style={{
                  backgroundColor: tier.color,
                  boxShadow: isActive
                    ? `0 0 0 3px white, 0 0 0 6px ${tier.color}`
                    : undefined,
                }}
              >
                {tier.label}
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          {active && (
            <motion.aside
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border-2 bg-white p-5 shadow-lg"
              style={{ borderColor: active.color }}
            >
              <p
                className="text-xs font-800 uppercase tracking-wide"
                style={{ color: active.color }}
              >
                Étage sélectionné
              </p>
              <h3 className="mt-1 text-xl font-800 text-ink">{active.label}</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-800 text-ink-soft">Fréquence</dt>
                  <dd className="font-700 text-ink">{active.frequency}</dd>
                </div>
                <div>
                  <dt className="font-800 text-ink-soft">Rôle</dt>
                  <dd className="font-700 text-ink">{active.role}</dd>
                </div>
                <div>
                  <dt className="font-800 text-ink-soft">Famille</dt>
                  <dd>
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-800 text-white"
                      style={{ backgroundColor: active.color }}
                    >
                      {active.family}
                    </span>
                  </dd>
                </div>
              </dl>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <p className="rounded-2xl bg-mint-light/70 px-4 py-3 text-sm font-600 text-mint-dark">
        💡 {schema.legend}
      </p>
    </div>
  )
}
