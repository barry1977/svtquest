import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { SchemaDefinition } from '@/types/course'

type Props = {
  schema: SchemaDefinition
}

export function ReactorSchema({ schema }: Props) {
  const weatherCtrl = schema.controls?.find((c) => c.id === 'weather')
  const activityCtrl = schema.controls?.find((c) => c.id === 'activity')
  const [weather, setWeather] = useState(weatherCtrl?.defaultValue ?? 20)
  const [activity, setActivity] = useState(activityCtrl?.defaultValue ?? 10)

  const coldFactor = (100 - weather) / 100
  const activityFactor = activity / 100
  const kj = Math.round(4500 + coldFactor * 3500 + activityFactor * 6000)
  const heartRate = Math.round(55 + activityFactor * 100)
  const heartDuration = Math.max(0.35, 1.1 - activityFactor * 0.7)
  const snowOpacity = coldFactor * 0.9

  const sparks = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        delay: i * 0.2,
        x: 20 + i * 10,
      })),
    [],
  )

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border-2 border-sky/20 bg-gradient-to-b from-sky-light via-white to-mint-light p-4 shadow-lg sm:p-6">
        {/* Snow overlay */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity"
          style={{ opacity: snowOpacity }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-sky"
              style={{ left: `${(i * 17) % 100}%`, top: -10 }}
              animate={{ y: [0, 420], opacity: [0.8, 0.2] }}
              transition={{
                duration: 3 + (i % 5),
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'linear',
              }}
            >
              ❄
            </motion.span>
          ))}
        </div>

        <div className="relative z-10 grid items-center gap-6 lg:grid-cols-[1fr_280px]">
          <svg viewBox="0 0 320 360" className="mx-auto h-[240px] w-full max-w-md sm:h-[300px]">
            {/* Body silhouette */}
            <ellipse cx="160" cy="70" rx="36" ry="40" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
            <path
              d="M110 120 C110 100, 210 100, 210 120 L225 260 C225 280, 95 280, 95 260 Z"
              fill="#FEF3C7"
              stroke="#F59E0B"
              strokeWidth="3"
            />
            <path d="M110 140 L70 210" stroke="#F59E0B" strokeWidth="14" strokeLinecap="round" />
            <path d="M210 140 L250 210" stroke="#F59E0B" strokeWidth="14" strokeLinecap="round" />
            <path d="M130 260 L120 330" stroke="#F59E0B" strokeWidth="16" strokeLinecap="round" />
            <path d="M190 260 L200 330" stroke="#F59E0B" strokeWidth="16" strokeLinecap="round" />

            {/* Heart */}
            <motion.g
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: heartDuration, repeat: Infinity }}
              style={{ transformOrigin: '160px 175px' }}
            >
              <path
                d="M160 195 C140 175, 125 160, 140 145 C150 135, 160 145, 160 145 C160 145, 170 135, 180 145 C195 160, 180 175, 160 195 Z"
                fill="#EF4444"
              />
            </motion.g>

            {/* Thermometer */}
            <rect x="268" y="90" width="18" height="140" rx="9" fill="white" stroke="#0284C7" strokeWidth="2" />
            <motion.rect
              x="272"
              y="120"
              width="10"
              height="95"
              rx="5"
              fill="#F97316"
              animate={{
                filter: [
                  'drop-shadow(0 0 2px #F97316)',
                  'drop-shadow(0 0 8px #F97316)',
                  'drop-shadow(0 0 2px #F97316)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <circle cx="277" cy="245" r="14" fill="#F97316" />
            <text x="277" y="80" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0284C7">
              37°C
            </text>

            {/* Food bowl -> sparks */}
            <circle cx="50" cy="300" r="28" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
            <text x="50" y="306" textAnchor="middle" fontSize="22">
              🥣
            </text>
            {sparks.map((s) => (
              <motion.text
                key={s.id}
                x={70}
                y={290}
                fontSize="14"
                initial={{ opacity: 0, x: 70, y: 290 }}
                animate={{ opacity: [0, 1, 0], x: [70, 140], y: [290, 180] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: s.delay,
                }}
              >
                ✨
              </motion.text>
            ))}
            <text x="50" y="345" textAnchor="middle" fontSize="11" fontWeight="700" fill="#C2410C">
              {kj} kJ
            </text>
          </svg>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white/90 p-4 shadow-md">
              <p className="text-xs font-800 uppercase text-sky-dark">Consommation</p>
              <p className="text-3xl font-800 text-tangerine">{kj} kJ</p>
              <p className="text-sm text-ink-soft">
                Rythme cardiaque ≈ {heartRate} bpm
              </p>
            </div>

            <label className="block rounded-2xl bg-white/90 p-4 shadow-md">
              <div className="mb-2 flex justify-between text-sm font-700">
                <span>{weatherCtrl?.label}</span>
                <span className="text-sky">{weather}°</span>
              </div>
              <input
                type="range"
                min={weatherCtrl?.min ?? 0}
                max={weatherCtrl?.max ?? 100}
                value={weather}
                onChange={(e) => setWeather(Number(e.target.value))}
                className="w-full accent-sky"
              />
              <div className="mt-1 flex justify-between text-xs text-ink-soft">
                <span>{weatherCtrl?.leftLabel}</span>
                <span>{weatherCtrl?.rightLabel}</span>
              </div>
              {coldFactor > 0.55 && (
                <p className="mt-2 text-xs font-700 text-sky-dark">
                  Grand froid : le corps brûle presque 2× plus pour garder 37°C !
                </p>
              )}
            </label>

            <label className="block rounded-2xl bg-white/90 p-4 shadow-md">
              <div className="mb-2 flex justify-between text-sm font-700">
                <span>{activityCtrl?.label}</span>
                <span className="text-tangerine">{activity}%</span>
              </div>
              <input
                type="range"
                min={activityCtrl?.min ?? 0}
                max={activityCtrl?.max ?? 100}
                value={activity}
                onChange={(e) => setActivity(Number(e.target.value))}
                className="w-full accent-tangerine"
              />
              <div className="mt-1 flex justify-between text-xs text-ink-soft">
                <span>{activityCtrl?.leftLabel}</span>
                <span>{activityCtrl?.rightLabel}</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <p className="rounded-2xl bg-sky-light/80 px-4 py-3 text-sm font-600 text-sky-dark">
        💡 {schema.legend}
      </p>
    </div>
  )
}
