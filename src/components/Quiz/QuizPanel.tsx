import type { Flashcard, QuizQuestion } from '@/types/course'
import { Flashcards } from './Flashcards'
import { QuizGame } from './QuizGame'

type Props = {
  flashcards: Flashcard[]
  quiz: QuizQuestion[]
  onStar?: () => void
}

export function QuizPanel({ flashcards, quiz, onStar }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-800 text-ink">Révision spéciale « Contrôle à venir »</h2>
        <p className="text-sm text-ink-soft">
          Flashcards + QCM chronométré (sans stress) pour te sentir prêt·e.
        </p>
      </div>
      <Flashcards cards={flashcards} onStar={onStar} />
      <QuizGame questions={quiz} onStar={onStar} />
    </div>
  )
}
