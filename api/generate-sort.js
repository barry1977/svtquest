/**
 * POST /api/generate-sort — set de tri aléatoire (Vercel).
 */
import { generateSortGameFromLesson } from '../server/generateSortGame.mjs'

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

    const result = await generateSortGameFromLesson(lesson, {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL,
      count: Number.parseInt(String(req.body?.count ?? '9'), 10),
      excludeNames: Array.isArray(req.body?.excludeNames)
        ? req.body.excludeNames
        : [],
    })

    res.status(200).json(result)
  } catch (error) {
    const status = Number(error?.status) || 500
    const message =
      error instanceof Error ? error.message : 'Erreur serveur inattendue'
    console.error('[api/generate-sort]', message)
    res.status(status).json({ error: message })
  }
}
