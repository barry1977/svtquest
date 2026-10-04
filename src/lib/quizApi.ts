import type { LabPractical, QuizQuestion, SortGameItem } from '@/types/course'
import type { LessonContextPayload } from './lessonContext'

export type GeneratedSortGame = {
  title: string
  description: string
  items: SortGameItem[]
}

export type QuizApiConfig = {
  quizGenerationEnabled: boolean
  model: string
  questionCount: number
}

export async function fetchQuizApiConfig(): Promise<QuizApiConfig> {
  const res = await fetch('/api/config')
  if (!res.ok) {
    return {
      quizGenerationEnabled: false,
      model: 'gpt-4o-mini',
      questionCount: 10,
    }
  }
  return (await res.json()) as QuizApiConfig
}

export async function generateQuizQuestions(
  lesson: LessonContextPayload,
  count?: number,
): Promise<QuizQuestion[]> {
  const res = await fetch('/api/generate-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lesson, count }),
  })

  const data = (await res.json().catch(() => ({}))) as {
    questions?: QuizQuestion[]
    error?: string
  }

  if (!res.ok) {
    throw new Error(data.error || `Échec génération (${res.status})`)
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error('Aucune question reçue du serveur')
  }

  return data.questions
}

export async function generateLabPractical(
  lesson: LessonContextPayload,
): Promise<LabPractical> {
  const res = await fetch('/api/generate-lab', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lesson }),
  })

  const data = (await res.json().catch(() => ({}))) as {
    lab?: LabPractical
    error?: string
  }

  if (!res.ok) {
    throw new Error(data.error || `Échec génération TP (${res.status})`)
  }

  if (!data.lab?.samples?.length || !data.lab.experiments?.length) {
    throw new Error('TP reçu invalide')
  }

  return data.lab
}

export async function generateSortGame(
  lesson: LessonContextPayload,
  count = 9,
  excludeNames: string[] = [],
): Promise<GeneratedSortGame> {
  const res = await fetch('/api/generate-sort', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lesson, count, excludeNames }),
  })

  const data = (await res.json().catch(() => ({}))) as {
    title?: string
    description?: string
    items?: SortGameItem[]
    error?: string
  }

  if (!res.ok) {
    throw new Error(data.error || `Échec génération tri (${res.status})`)
  }

  if (!Array.isArray(data.items) || data.items.length < 6) {
    throw new Error('Set de tri reçu invalide')
  }

  return {
    title: data.title || 'Le Tri Express des Aliments',
    description:
      data.description ||
      'Classe chaque aliment : Bâtisseurs, Énergétiques ou Fonctionnels.',
    items: data.items,
  }
}
