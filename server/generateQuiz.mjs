/**
 * Appelle OpenAI côté serveur uniquement.
 * La clé API ne quitte jamais ce process.
 */

const DEFAULT_MODEL = 'gpt-4o-mini'
const DEFAULT_COUNT = 10

/**
 * @typedef {{
 *   title: string
 *   level?: string
 *   objectives?: string[]
 *   keyPoints?: string[]
 *   remember?: string[]
 *   flashcards?: string[]
 * }} LessonContext
 */

/**
 * @param {LessonContext} lesson
 * @param {{ apiKey: string, model?: string, count?: number }} options
 */
export async function generateQuizFromLesson(lesson, options) {
  const apiKey = options.apiKey
  if (!apiKey) {
    const err = new Error('OPENAI_API_KEY manquante côté serveur')
    err.status = 503
    throw err
  }

  const count = clampInt(options.count ?? DEFAULT_COUNT, 3, 15)
  const model = options.model || DEFAULT_MODEL

  const lessonText = formatLesson(lesson)
  if (!lessonText.trim()) {
    const err = new Error('Contexte de leçon vide')
    err.status = 400
    throw err
  }

  const system = `Tu es un professeur de SVT collège (6ème/5ème) en France.
Tu génères des QCM strictement basés sur le contenu de la leçon fournie.
Réponds UNIQUEMENT avec un JSON valide (pas de markdown) de la forme :
{
  "questions": [
    {
      "id": "ai-1",
      "question": "...",
      "choices": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "...",
      "tipOnError": "..."
    }
  ]
}
Règles :
- exactement ${count} questions
- 4 choix par question, une seule bonne réponse
- correctIndex entre 0 et 3
- niveau collège, formulations claires
- pas de questions hors leçon`

  const user = `Génère ${count} questions QCM pour ce chapitre :

Titre : ${lesson.title || 'Chapitre SVT'}
Niveau : ${lesson.level || 'collège'}

Contenu de la leçon :
${lessonText}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.8,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    const err = new Error(
      `OpenAI a renvoyé ${response.status}${detail ? ` : ${detail.slice(0, 200)}` : ''}`,
    )
    err.status = response.status === 401 ? 502 : 502
    throw err
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content || typeof content !== 'string') {
    const err = new Error('Réponse OpenAI vide')
    err.status = 502
    throw err
  }

  let parsed
  try {
    parsed = JSON.parse(content)
  } catch {
    const err = new Error('JSON OpenAI invalide')
    err.status = 502
    throw err
  }

  const questions = normalizeQuestions(parsed?.questions, count)
  if (questions.length === 0) {
    const err = new Error('Aucune question valide générée')
    err.status = 502
    throw err
  }

  return { questions, model }
}

/** @param {LessonContext} lesson */
function formatLesson(lesson) {
  const blocks = []
  if (lesson.objectives?.length) {
    blocks.push('Objectifs :\n- ' + lesson.objectives.join('\n- '))
  }
  if (lesson.keyPoints?.length) {
    blocks.push('Points clés :\n- ' + lesson.keyPoints.join('\n- '))
  }
  if (lesson.remember?.length) {
    blocks.push('À retenir :\n- ' + lesson.remember.join('\n- '))
  }
  if (lesson.flashcards?.length) {
    blocks.push('Flashcards :\n- ' + lesson.flashcards.join('\n- '))
  }
  return blocks.join('\n\n')
}

/**
 * @param {unknown} raw
 * @param {number} count
 */
function normalizeQuestions(raw, count) {
  if (!Array.isArray(raw)) return []

  return raw
    .slice(0, count)
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null
      const q = /** @type {Record<string, unknown>} */ (item)
      const question = String(q.question ?? '').trim()
      const choices = Array.isArray(q.choices)
        ? q.choices.map((c) => String(c).trim()).filter(Boolean)
        : []
      const correctIndex = Number(q.correctIndex)
      const explanation = String(q.explanation ?? '').trim()
      const tipOnError = String(q.tipOnError ?? '').trim()

      if (
        !question ||
        choices.length !== 4 ||
        !Number.isInteger(correctIndex) ||
        correctIndex < 0 ||
        correctIndex > 3 ||
        !explanation
      ) {
        return null
      }

      return {
        id: String(q.id ?? `ai-${index + 1}`),
        question,
        choices,
        correctIndex,
        explanation,
        tipOnError:
          tipOnError || 'Relis les points clés du chapitre avant de réessayer.',
      }
    })
    .filter(Boolean)
}

/** @param {number} value @param {number} min @param {number} max */
function clampInt(value, min, max) {
  const n = Number.parseInt(String(value), 10)
  if (Number.isNaN(n)) return min
  return Math.min(max, Math.max(min, n))
}
