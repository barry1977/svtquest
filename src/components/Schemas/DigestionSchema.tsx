import { motion } from 'framer-motion'
import type { SchemaDefinition } from '@/types/course'

const NUTRIENTS = [
  { color: '#0284C7', label: 'Eau', emoji: '💧' },
  { color: '#FBBF24', label: 'Glucides & Lipides', emoji: '⚡' },
  { color: '#EF4444', label: 'Protéines', emoji: '🧱' },
  { color: '#10B981', label: 'Vitamines & Minéraux', emoji: '🛡️' },
]

type Props = {
  schema: SchemaDefinition
}

export function DigestionSchema({ schema }: Props) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border-2 border-tangerine/20 bg-gradient-to-r from-tangerine-light/40 via-white to-mint-light/50 p-4 shadow-lg sm:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white p-4 shadow-md"
          >
            <p className="text-xs font-800 uppercase text-tangerine-dark">Étape 1</p>
            <h3 className="font-800 text-ink">{schema.steps?.[0]?.title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{schema.steps?.[0]?.description}</p>
            <div className="mt-4 flex justify-center gap-3 text-4xl">
              <motion.span animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                🥛
              </motion.span>
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
              >
                🍎
              </motion.span>
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}
              >
                🍗
              </motion.span>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl bg-white p-4 shadow-md"
          >
            <p className="text-xs font-800 uppercase text-violet-dark">Étape 2</p>
            <h3 className="font-800 text-ink">{schema.steps?.[1]?.title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{schema.steps?.[1]?.description}</p>
            <div className="relative mt-6 flex h-24 items-center justify-center">
              <span className="text-4xl">🍞🥩</span>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl"
                  style={{ left: `${30 + i * 20}%` }}
                  animate={{
                    rotate: [0, -25, 25, 0],
                    x: [0, 8, -8, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
                >
                  ✂️
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-white p-4 shadow-md"
          >
            <p className="text-xs font-800 uppercase text-mint-dark">Étape 3</p>
            <h3 className="font-800 text-ink">{schema.steps?.[2]?.title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{schema.steps?.[2]?.description}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {NUTRIENTS.map((n, i) => (
                <motion.div
                  key={n.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm shadow"
                  style={{ backgroundColor: n.color, color: 'white' }}
                  animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.2 }}
                  title={n.label}
                >
                  ●
                </motion.div>
              ))}
            </div>
            <div className="mt-3 space-y-1">
              {NUTRIENTS.map((n) => (
                <div key={n.label} className="flex items-center gap-2 text-xs font-700">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: n.color }}
                  />
                  {n.emoji} {n.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Flow arrows on desktop */}
        <div className="mt-4 hidden justify-center gap-8 text-2xl text-ink-soft md:flex">
          <span>→</span>
          <span>→</span>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-mint/30 bg-mint-light/60 px-4 py-3 text-sm font-700 text-mint-dark">
        💬 Bulle mémo : {schema.legend}
      </div>
    </div>
  )
}
