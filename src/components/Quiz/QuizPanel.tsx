import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { CourseModule, Flashcard, QuizQuestion } from '@/types/course'
import { buildLessonContext } from '@/lib/lessonContext'
import { fetchQuizApiConfig, generateQuizQuestions } from '@/lib/quizApi'
import { Flashcards } from './Flashcards'
import { QuizGame } from './QuizGame'

type Props = {
  course: CourseModule
  flashcards: Flashcard[]
  quiz: QuizQuestion[]
  onStar?: () => void
}

export function QuizPanel({ course, flashcards, quiz, onStar }: Props) {
  const [questions, setQuestions] = useState(quiz)
  const [generationEnabled, setGenerationEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<'cours' | 'ia'>('cours')

  useEffect(() => {
    setQuestions(quiz)
    setSource('cours')
    setError(null)
  }, [quiz, course.id])

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
      const next = await generateQuizQuestions(buildLessonContext(course))
      setQuestions(next)
      setSource('ia')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de générer les questions pour le moment.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setQuestions(quiz)
    setSource('cours')
    setError(null)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-800 text-ink">Révision spéciale « Contrôle à venir »</h2>
        <p className="text-sm text-ink-soft">
          Flashcards + QCM chronométré (sans stress) pour te sentir prêt·e.
        </p>
      </div>
      <Flashcards cards={flashcards} onStar={onStar} />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!generationEnabled || loading}
          className="inline-flex items-center gap-2 rounded-2xl bg-sky px-4 py-2.5 text-sm font-800 text-white shadow-md transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          title={
            generationEnabled
              ? 'Générer un nouveau QCM à partir de la leçon'
              : 'Génération indisponible pour le moment'
          }
        >
          <Sparkles size={16} />
          {loading ? 'Génération…' : 'Nouveau QCM'}
        </button>
        {source === 'ia' && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-800 text-ink transition hover:bg-slate-50"
          >
            QCM du cours
          </button>
        )}
        <span className="text-xs font-700 text-ink-soft">
          {source === 'ia' ? 'Nouveau QCM' : 'QCM du cours'}
        </span>
      </div>

      {error && (
        <p className="rounded-xl border border-tangerine/30 bg-tangerine-light px-3 py-2 text-sm font-700 text-tangerine-dark">
          {error}
        </p>
      )}

      <QuizGame key={`${course.id}-${source}-${questions[0]?.id ?? 'empty'}`} questions={questions} onStar={onStar} />
    </div>
  )
}
