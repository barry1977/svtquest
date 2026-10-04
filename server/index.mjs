import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateQuizFromLesson } from './generateQuiz.mjs'
import { generateLabFromLesson } from './generateLab.mjs'
import { generateSortGameFromLesson } from './generateSortGame.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const isProd = process.env.NODE_ENV === 'production'
const port = Number.parseInt(process.env.PORT || '8787', 10)

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '64kb' }))

app.get('/health', (_req, res) => {
  res.type('text/plain').send('ok')
})

app.get('/api/config', (_req, res) => {
  // Jamais de secret ici — seulement des flags publics.
  res.json({
    quizGenerationEnabled: Boolean(process.env.OPENAI_API_KEY),
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    questionCount: Number.parseInt(process.env.OPENAI_QUESTION_COUNT || '10', 10),
  })
})

app.post('/api/generate-quiz', async (req, res) => {
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

    res.json(result)
  } catch (error) {
    const status = Number(error?.status) || 500
    const message =
      error instanceof Error ? error.message : 'Erreur serveur inattendue'
    console.error('[generate-quiz]', message)
    res.status(status).json({ error: message })
  }
})

app.post('/api/generate-lab', async (req, res) => {
  try {
    const lesson = req.body?.lesson
    if (!lesson || typeof lesson !== 'object') {
      res.status(400).json({ error: 'Corps invalide : lesson requis' })
      return
    }

    const result = await generateLabFromLesson(lesson, {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL,
    })

    res.json(result)
  } catch (error) {
    const status = Number(error?.status) || 500
    const message =
      error instanceof Error ? error.message : 'Erreur serveur inattendue'
    console.error('[generate-lab]', message)
    res.status(status).json({ error: message })
  }
})

app.post('/api/generate-sort', async (req, res) => {
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

    res.json(result)
  } catch (error) {
    const status = Number(error?.status) || 500
    const message =
      error instanceof Error ? error.message : 'Erreur serveur inattendue'
    console.error('[generate-sort]', message)
    res.status(status).json({ error: message })
  }
})

if (isProd) {
  app.use(
    express.static(distDir, {
      index: false,
      maxAge: '1h',
      setHeaders(res, filePath) {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=2592000, immutable')
        }
      },
    }),
  )

  // SPA fallback (Express 5 : éviter app.get('*'))
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next()
      return
    }
    if (req.path.startsWith('/api/')) {
      next()
      return
    }
    res.sendFile(path.join(distDir, 'index.html'), (err) => {
      if (err) next(err)
    })
  })
}

app.listen(port, () => {
  console.log(
    `[svtquest-api] écoute sur http://localhost:${port} (${isProd ? 'prod' : 'dev'})`,
  )
  if (!process.env.OPENAI_API_KEY) {
    console.warn(
      '[svtquest-api] OPENAI_API_KEY absente — génération quiz/labo en 503',
    )
  }
})
