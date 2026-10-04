/**
 * GET /api/config — flags publics uniquement (jamais de secrets).
 * Utilisé sur Vercel (serverless). En local, Express sert la même route.
 */
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  res.status(200).json({
    quizGenerationEnabled: Boolean(process.env.OPENAI_API_KEY),
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    questionCount: Number.parseInt(process.env.OPENAI_QUESTION_COUNT || '10', 10),
  })
}
