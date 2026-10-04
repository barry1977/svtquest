/**
 * POST /api/generate-quiz — appelle OpenAI côté serveur Vercel.
 * OPENAI_API_KEY vient des Environment Variables Vercel (jamais du navigateur).
 */
import { generateQuizFromLesson } from '../server/generateQuiz.mjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  try {
    const lesson = req.body?.lesson
    if (!lesson || typeof lesson !== 'object') {
      res.status(400).json({ error: 'Corps invalide : lesson requis' })
      return
    }

    const result = await generateQuizFromLesson(lesson, {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL,
      count: Number.parseInt(
        String(req.body?.count ?? process.env.OPENAI_QUESTION_COUNT ?? '10'),
        10,
      ),
    })

    res.status(200).json(result)
  } catch (error) {
    const status = Number(error?.status) || 500
    const message =
      error instanceof Error ? error.message : 'Erreur serveur inattendue'
    console.error('[api/generate-quiz]', message)
    res.status(status).json({ error: message })
  }
}
