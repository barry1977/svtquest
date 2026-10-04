/**
 * Génère un TP de labo ludique via OpenAI (thème de la leçon).
 * La clé API ne quitte jamais ce process.
 */

const DEFAULT_MODEL = 'gpt-4o-mini'

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
 * @param {{ apiKey: string, model?: string }} options
 */
export async function generateLabFromLesson(lesson, options) {
  const apiKey = options.apiKey
  if (!apiKey) {
    const err = new Error('OPENAI_API_KEY manquante côté serveur')
    err.status = 503
    throw err
  }

  const model = options.model || DEFAULT_MODEL
  const lessonText = formatLesson(lesson)
  if (!lessonText.trim()) {
    const err = new Error('Contexte de leçon vide')
    err.status = 400
    throw err
  }

  const system = `Tu es un professeur de SVT collège (6ème/5ème) en France.
Tu conçois un TP virtuel LUDIQUE (mission / enquête) strictement lié au thème de la leçon.
Réponds UNIQUEMENT avec un JSON valide (pas de markdown) de cette forme :
{
  "lab": {
    "title": "Mission ...",
    "missionBrief": "accroche fun 1-2 phrases",
    "problem": "problématique scientifique",
    "steps": [
      { "title": "1. ...", "description": "..." }
    ],
    "samples": [
      { "id": "slug", "name": "Nom", "emoji": "🍞" }
    ],
    "reagents": [
      {
        "id": "slug",
        "name": "Nom du réactif",
        "description": "court",
        "testsFor": "nutriment ciblé"
      }
    ],
    "experiments": [
      {
        "id": "sample-reagent",
        "sampleId": "slug sample existant",
        "reagentId": "slug reagent existant",
        "observation": "...",
        "interpretation": "...",
        "resultColor": "#4C1D95",
        "visualHint": "phrase fun courte"
      }
    ],
    "conclusion": "J'observe que... donc je déduis que...",
    "competences": [
      { "code": "D4", "title": "...", "description": "..." }
    ],
    "challenge": {
      "title": "Défi final",
      "prompt": "question",
      "options": [
        { "id": "a", "label": "...", "correct": true },
        { "id": "b", "label": "...", "correct": false },
        { "id": "c", "label": "...", "correct": false },
        { "id": "d", "label": "...", "correct": false }
      ],
      "successMessage": "bravo..."
    }
  }
}
Règles :
- rester dans le thème (besoins alimentaires / nutriments / tests collège)
- 5 à 8 échantillons dont 1 témoin eau
- 3 à 4 réactifs réalistes (Lugol, Fehling, oxalate, papier gras…)
- 6 à 10 expériences cohérentes (sampleId/reagentId valides)
- 4 à 5 steps de protocole
- 1 challenge avec exactement 1 option correcte
- ton ludique mais scientifiquement correct
- resultColor en hex #RRGGBB
- emojis alimentaires dans samples`

  const user = `Invente un NOUVEAU TP aléatoire (pas une copie) pour ce chapitre :

Titre : ${lesson.title || 'Chapitre SVT'}
Niveau : ${lesson.level || 'collège'}

Contenu :
${lessonText}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.95,
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
    err.status = 502
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

  const lab = normalizeLab(parsed?.lab ?? parsed)
  if (!lab) {
    const err = new Error('TP généré invalide')
    err.status = 502
    throw err
  }

  return { lab, model }
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

/** @param {unknown} raw */
function normalizeLab(raw) {
  if (!raw || typeof raw !== 'object') return null
  const lab = /** @type {Record<string, unknown>} */ (raw)

  const title = String(lab.title ?? '').trim()
  const problem = String(lab.problem ?? '').trim()
  const conclusion = String(lab.conclusion ?? '').trim()
  if (!title || !problem || !conclusion) return null

  const samples = Array.isArray(lab.samples)
    ? lab.samples
        .map((s, i) => {
          if (!s || typeof s !== 'object') return null
          const item = /** @type {Record<string, unknown>} */ (s)
          const id = slug(String(item.id ?? `sample-${i}`))
          const name = String(item.name ?? '').trim()
          const emoji = String(item.emoji ?? '🔬').trim() || '🔬'
          if (!name) return null
          return { id, name, emoji }
        })
        .filter(Boolean)
    : []

  const reagents = Array.isArray(lab.reagents)
    ? lab.reagents
        .map((r, i) => {
          if (!r || typeof r !== 'object') return null
          const item = /** @type {Record<string, unknown>} */ (r)
          const id = slug(String(item.id ?? `reagent-${i}`))
          const name = String(item.name ?? '').trim()
          if (!name) return null
          return {
            id,
            name,
            description: String(item.description ?? '').trim() || name,
            testsFor: String(item.testsFor ?? '').trim() || 'Nutriment',
          }
        })
        .filter(Boolean)
    : []

  const sampleIds = new Set(samples.map((s) => s.id))
  const reagentIds = new Set(reagents.map((r) => r.id))

  const experiments = Array.isArray(lab.experiments)
    ? lab.experiments
        .map((e, i) => {
          if (!e || typeof e !== 'object') return null
          const item = /** @type {Record<string, unknown>} */ (e)
          const sampleId = slug(String(item.sampleId ?? ''))
          const reagentId = slug(String(item.reagentId ?? ''))
          if (!sampleIds.has(sampleId) || !reagentIds.has(reagentId)) return null
          const observation = String(item.observation ?? '').trim()
          const interpretation = String(item.interpretation ?? '').trim()
          if (!observation || !interpretation) return null
          return {
            id: slug(String(item.id ?? `${sampleId}-${reagentId}-${i}`)),
            sampleId,
            reagentId,
            observation,
            interpretation,
            resultColor: normalizeHex(item.resultColor) || '#38BDF8',
            visualHint:
              String(item.visualHint ?? '').trim() ||
              `${observation} → ${interpretation}`,
          }
        })
        .filter(Boolean)
    : []

  if (samples.length < 3 || reagents.length < 2 || experiments.length < 4) {
    return null
  }

  const steps = Array.isArray(lab.steps)
    ? lab.steps
        .map((step) => {
          if (!step || typeof step !== 'object') return null
          const item = /** @type {Record<string, unknown>} */ (step)
          const stTitle = String(item.title ?? '').trim()
          const description = String(item.description ?? '').trim()
          if (!stTitle || !description) return null
          return { title: stTitle, description }
        })
        .filter(Boolean)
        .slice(0, 6)
    : []

  const competences = Array.isArray(lab.competences)
    ? lab.competences
        .map((c, i) => {
          if (!c || typeof c !== 'object') return null
          const item = /** @type {Record<string, unknown>} */ (c)
          const cTitle = String(item.title ?? '').trim()
          if (!cTitle) return null
          return {
            code: String(item.code ?? `C${i + 1}`).trim(),
            title: cTitle,
            description: String(item.description ?? '').trim() || cTitle,
          }
        })
        .filter(Boolean)
        .slice(0, 4)
    : []

  const challenge = normalizeChallenge(lab.challenge)

  return {
    title,
    problem,
    missionBrief: String(lab.missionBrief ?? '').trim() || undefined,
    steps: steps.length ? steps : undefined,
    samples,
    reagents,
    experiments,
    conclusion,
    competences:
      competences.length > 0
        ? competences
        : [
            {
              code: 'D4',
              title: 'Pratiquer des démarches scientifiques',
              description: 'Observer, comparer à un témoin et conclure.',
            },
          ],
    challenge: challenge ?? undefined,
  }
}

/** @param {unknown} raw */
function normalizeChallenge(raw) {
  if (!raw || typeof raw !== 'object') return null
  const ch = /** @type {Record<string, unknown>} */ (raw)
  const title = String(ch.title ?? '').trim()
  const prompt = String(ch.prompt ?? '').trim()
  const successMessage = String(ch.successMessage ?? '').trim()
  if (!title || !prompt) return null

  const options = Array.isArray(ch.options)
    ? ch.options
        .map((o, i) => {
          if (!o || typeof o !== 'object') return null
          const item = /** @type {Record<string, unknown>} */ (o)
          const label = String(item.label ?? '').trim()
          if (!label) return null
          return {
            id: String(item.id ?? String.fromCharCode(97 + i)),
            label,
            correct: Boolean(item.correct),
          }
        })
        .filter(Boolean)
    : []

  if (options.length < 2 || !options.some((o) => o.correct)) return null

  return {
    title,
    prompt,
    options: options.slice(0, 4),
    successMessage: successMessage || 'Bravo, défi réussi !',
  }
}

/** @param {string} value */
function slug(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
}

/** @param {unknown} value */
function normalizeHex(value) {
  const s = String(value ?? '').trim()
  return /^#[0-9A-Fa-f]{6}$/.test(s) ? s.toUpperCase() : null
}
