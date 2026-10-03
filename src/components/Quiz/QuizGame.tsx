import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Trophy } from 'lucide-react'
import type { QuizQuestion } from '@/types/course'
import { celebrateStars } from '@/lib/confetti'

type Props = {
  questions: QuizQuestion[]
  onStar?: () => void
}

export function QuizGame({ questions, onStar }: Props) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => questions.map(() => null),
  )
  const [seconds, setSeconds] = useState(0)
  const [finished, setFinished] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (finished) return
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(t)
  }, [finished])

  const q = questions[index]
  const score20 = useMemo(() => {
    const correct = answers.reduce<number>((acc, a, i) => {
      if (a === questions[i]?.correctIndex) return acc + 1
      return acc
    }, 0)
    return Math.round((correct / questions.length) * 20)
  }, [answers, questions])

  const tips = useMemo(
    () =>
      questions
        .map((question, i) =>
          answers[i] !== null && answers[i] !== question.correctIndex
            ? question.tipOnError
            : null,
        )
        .filter(Boolean) as string[],
    [answers, questions],
  )

  const choose = (choiceIndex: number) => {
    if (finished || !q || answers[index] !== null) return
    const next = [...answers]
    next[index] = choiceIndex
    setAnswers(next)
    const ok = choiceIndex === q.correctIndex
    setFeedback(ok ? `✅ ${q.explanation}` : `❌ ${q.explanation}`)
    if (ok) onStar?.()

    setTimeout(() => {
      setFeedback(null)
      if (index + 1 >= questions.length) {
        setFinished(true)
        if (Math.round(((next.filter((a, i) => a === questions[i].correctIndex).length) / questions.length) * 20) >= 14) {
          celebrateStars()
        }
      } else {
        setIndex((i) => i + 1)
      }
    }, 1400)
  }

  const restart = () => {
    setIndex(0)
    setAnswers(questions.map(() => null))
    setSeconds(0)
    setFinished(false)
    setFeedback(null)
  }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  if (finished) {
    return (
      <div className="rounded-2xl border-2 border-mint/30 bg-gradient-to-br from-mint-light to-white p-6 text-center shadow-lg">
        <Trophy className="mx-auto text-tangerine" size={40} />
        <h3 className="mt-2 text-2xl font-800 text-ink">Résultat du QCM</h3>
        <p className="mt-2 text-4xl font-800 text-mint-dark">{score20}/20</p>
        <p className="mt-1 text-sm font-700 text-ink-soft">
          Temps : {mins}:{secs.toString().padStart(2, '0')} — sans stress, bravo d&apos;avoir terminé !
        </p>
        {score20 >= 16 && (
          <p className="mt-3 font-800 text-mint-dark">
            Tu es fin prête pour ton contrôle !
          </p>
        )}
        {tips.length > 0 && (
          <div className="mt-4 rounded-xl bg-white p-4 text-left">
            <p className="text-xs font-800 uppercase text-tangerine-dark">
              Conseils ciblés
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-600 text-ink">
              {[...new Set(tips)].map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          type="button"
          onClick={restart}
          className="mt-4 rounded-2xl bg-mint px-5 py-2.5 text-sm font-800 text-white shadow-md"
        >
          Refaire le QCM
        </button>
      </div>
    )
  }

  if (!q) return null

  return (
    <div className="space-y-4 rounded-2xl border-2 border-sky/20 bg-white p-4 shadow-lg sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-800 text-ink">QCM 10 questions type collège</h3>
        <div className="inline-flex items-center gap-1 rounded-full bg-sky-light px-3 py-1 text-xs font-800 text-sky-dark">
          <Clock size={14} />
          {mins}:{secs.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="h-full bg-sky"
          animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-xs font-700 text-ink-soft">
        Question {index + 1} / {questions.length}
      </p>
      <p className="text-lg font-800 text-ink">{q.question}</p>

      <div className="grid gap-2">
        {q.choices.map((choice, i) => {
          const selected = answers[index] === i
          const revealed = answers[index] !== null
          const isCorrect = i === q.correctIndex
          let style = 'bg-slate-50 hover:bg-sky-light border-slate-200'
          if (revealed && isCorrect) style = 'bg-mint-light border-mint text-mint-dark'
          else if (revealed && selected && !isCorrect)
            style = 'bg-tangerine-light border-tangerine text-tangerine-dark'

          return (
            <button
              key={choice}
              type="button"
              disabled={revealed}
              onClick={() => choose(i)}
              className={`rounded-2xl border-2 px-4 py-3 text-left text-sm font-700 transition ${style}`}
            >
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-800 shadow-sm">
                {String.fromCharCode(65 + i)}
              </span>
              {choice}
            </button>
          )
        })}
      </div>

      {feedback && (
        <p className="rounded-xl bg-violet-light px-3 py-2 text-sm font-700 text-violet-dark">
          {feedback}
        </p>
      )}
    </div>
  )
}
