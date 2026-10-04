import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { CourseModule, LabPractical } from '@/types/course'
import { buildLessonContext } from '@/lib/lessonContext'
import { fetchQuizApiConfig, generateLabPractical } from '@/lib/quizApi'
import { LabBench } from './LabBench'

type Props = {
  course: CourseModule
  lab: LabPractical
  onStar?: () => void
}

export function LabPanel({ course, lab, onStar }: Props) {
  const [currentLab, setCurrentLab] = useState(lab)
  const [generationEnabled, setGenerationEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<'cours' | 'ia'>('cours')

  useEffect(() => {
    setCurrentLab(lab)
    setSource('cours')
    setError(null)
  }, [lab, course.id])

  useEffect(() => {
    let cancelled = false
    fetchQuizApiConfig()
      .then((config) => {
        if (!cancelled) setGenerationEnabled(config.quizGenerationEnabled)
      })
      .catch(() => {
        if (!cancelled) setGenerationEnabled(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const next = await generateLabPractical(buildLessonContext(course))
      setCurrentLab(next)
      setSource('ia')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de générer un TP pour le moment.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setCurrentLab(lab)
    setSource('cours')
    setError(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!generationEnabled || loading}
          className="inline-flex items-center gap-2 rounded-2xl bg-violet-soft px-4 py-2.5 text-sm font-800 text-white shadow-md transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          title={
            generationEnabled
              ? 'Générer un nouveau TP sur le thème de la leçon'
              : 'Génération indisponible pour le moment'
          }
        >
          <Sparkles size={16} />
          {loading ? 'Génération…' : 'Nouveau TP'}
        </button>
        {source === 'ia' && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-800 text-ink transition hover:bg-slate-50"
          >
            TP du cours
          </button>
        )}
        <span className="text-xs font-700 text-ink-soft">
          {source === 'ia' ? 'Nouveau TP' : 'TP du cours'}
        </span>
      </div>

      {error && (
        <p className="rounded-xl border border-tangerine/30 bg-tangerine-light px-3 py-2 text-sm font-700 text-tangerine-dark">
          {error} — le TP du cours reste disponible.
        </p>
      )}

      <LabBench
        key={`${course.id}-${source}-${currentLab.title}`}
        lab={currentLab}
        onStar={onStar}
      />
    </div>
  )
}
