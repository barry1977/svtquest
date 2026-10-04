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
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col items-center rounded-2xl border-2 border-mint/20 bg-gradient-to-b from-sky-light/40 via-white to-mint-light/30 p-3 shadow-lg sm:p-6">
          <p className="mb-3 text-center text-[11px] font-800 uppercase tracking-wide text-ink-soft">
            Sommet = rarement · Base = souvent
          </p>
          {tiers.map((tier, index) => {
            // Largeur croissante, mais jamais trop étroite pour les icônes
            const widthPercent = Math.min(96, 52 + index * 7)
            const isActive = activeId === tier.id
            const foods = tier.foods ?? []
            return (
              <motion.button
                key={tier.id}
                type="button"
                onMouseEnter={() => setActiveId(tier.id)}
                onFocus={() => setActiveId(tier.id)}
                onClick={() => setActiveId(tier.id)}
                animate={{
                  scale: isActive ? 1.02 : 1,
                  width: `${widthPercent}%`,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="relative my-1.5 w-full max-w-full rounded-2xl px-3 py-3 text-center text-white shadow-md"
                style={{
                  backgroundColor: tier.color,
                  boxShadow: isActive
                    ? `0 0 0 3px white, 0 0 0 6px ${tier.color}`
                    : undefined,
                  minWidth: 'min(100%, 240px)',
                }}
              >
                <span className="block text-xs font-800 leading-snug sm:text-sm">
                  {tier.label}
                </span>
                {foods.length > 0 && (
                  <span className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                    {foods.map((food) => (
                      <span
                        key={`${tier.id}-${food.name}`}
                        title={food.name}
                        className="emoji inline-flex items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[1.35rem] shadow-md ring-2 ring-white/80"
                        aria-label={food.name}
                      >
                        {food.emoji}
                      </span>
                    ))}
                  </span>
                )}
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

              {(active.foods?.length ?? 0) > 0 && (
                <div className="mt-3">
                  <p className="mb-2 text-xs font-800 uppercase text-ink-soft">
                    Exemples d&apos;aliments
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {active.foods!.map((food) => (
                      <span
                        key={food.name}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1.5 text-xs font-700 text-ink shadow-sm ring-1 ring-slate-200"
                      >
                        <span className="emoji text-xl">{food.emoji}</span>
                        {food.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
