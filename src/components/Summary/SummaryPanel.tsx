import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpenCheck,
  Lightbulb,
  Target,
} from 'lucide-react'
import type { AppSection, CourseSummary } from '@/types/course'

type Props = {
  summary: CourseSummary
  level: string
  icon: string
  onNavigate: (section: AppSection) => void
}

export function SummaryPanel({ summary, level, icon, onNavigate }: Props) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-mint via-sky to-violet-soft p-5 text-white shadow-lg sm:p-8">
        <div className="absolute -right-6 -top-6 text-8xl opacity-20 sm:text-9xl" aria-hidden>
          {icon}
        </div>
        <p className="text-xs font-800 uppercase tracking-wider text-white/85">
          Chapitre · {level} · Page de résumé
        </p>
        <h2 className="mt-2 max-w-2xl text-2xl font-800 leading-tight sm:text-3xl">
          {summary.heroTitle}
        </h2>
        <p className="mt-3 max-w-2xl text-sm font-600 leading-relaxed text-white/95 sm:text-base">
          {summary.heroSubtitle}
        </p>
        <button
          type="button"
          onClick={() => onNavigate('mindmap')}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-800 text-mint-dark shadow-md transition hover:bg-mint-light"
        >
          Commencer par la carte mentale
          <ArrowRight size={16} />
        </button>
      </section>

      {/* Objectives */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-800 text-ink">
          <Target size={20} className="text-tangerine" />
          Objectifs du chapitre
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {summary.objectives.map((obj, i) => (
            <motion.li
              key={obj}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3 rounded-2xl bg-white p-3 text-sm font-600 text-ink shadow-md"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tangerine-light text-xs font-800 text-tangerine-dark">
                {i + 1}
              </span>
              <span className="leading-snug">{obj}</span>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Key points */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-800 text-ink">
          <BookOpenCheck size={20} className="text-mint" />
          L&apos;essentiel à retenir
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {summary.keyPoints.map((point, i) => (
            <motion.article
              key={point.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className="rounded-2xl border-2 bg-white p-4 shadow-md"
              style={{ borderColor: `${point.color}55` }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl" aria-hidden>
                  {point.icon}
                </span>
                <h4 className="font-800 text-ink" style={{ color: point.color }}>
                  {point.title}
                </h4>
              </div>
              <p className="text-sm font-600 leading-relaxed text-ink-soft">
                {point.text}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Remember box */}
      <section className="rounded-2xl border-2 border-sky/30 bg-sky-light/60 p-4 sm:p-5">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-800 text-sky-dark">
          <Lightbulb size={20} />
          Mémo express avant le contrôle
        </h3>
        <ul className="space-y-2">
          {summary.remember.map((line) => (
            <li
              key={line}
              className="flex gap-2 text-sm font-700 text-ink"
            >
              <span className="text-sky" aria-hidden>
                ✓
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Roadmap */}
      <section>
        <h3 className="mb-3 text-lg font-800 text-ink">Parcours dans l&apos;application</h3>
        <div className="hide-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible">
          {summary.roadmap.map((step, i) => (
            <button
              key={step.section}
              type="button"
              onClick={() => onNavigate(step.section)}
              className="flex w-[160px] shrink-0 flex-col rounded-2xl bg-white p-3 text-left shadow-md transition hover:bg-mint-light sm:w-auto"
            >
              <span className="text-xs font-800 text-mint-dark">Étape {i + 1}</span>
              <span className="mt-1 font-800 text-ink">{step.label}</span>
              <span className="mt-1 text-xs font-600 text-ink-soft">{step.blurb}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-800 text-sky">
                Y aller <ArrowRight size={12} />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
