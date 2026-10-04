/**
 * Génère un jeu de tri d'aliments via OpenAI (thème de la leçon).
 */

const DEFAULT_MODEL = 'gpt-4o-mini'
const CATEGORIES = new Set(['batisseur', 'energetique', 'fonctionnel'])

/**
 * @param {{
 *   title?: string
 *   level?: string
 *   objectives?: string[]
 *   keyPoints?: string[]
 *   remember?: string[]
 *   flashcards?: string[]
 * }} lesson
 * @param {{ apiKey: string, model?: string, count?: number, excludeNames?: string[] }} options
 */
export async function generateSortGameFromLesson(lesson, options) {
  const apiKey = options.apiKey
  if (!apiKey) {
    const err = new Error('OPENAI_API_KEY manquante côté serveur')
    err.status = 503
    throw err
  }

  const model = options.model || DEFAULT_MODEL
  const count = clampInt(options.count ?? 9, 6, 12)
  const excludeNames = Array.isArray(options.excludeNames)
    ? options.excludeNames.map((n) => String(n).trim()).filter(Boolean).slice(0, 40)
    : []
  const lessonText = formatLesson(lesson)
  if (!lessonText.trim()) {
    const err = new Error('Contexte de leçon vide')
    err.status = 400
    throw err
  }

  const banned = [
    'pain',
    'steak',
    'brocoli',
    'banane',
    'eau',
    'fromage',
    'huile',
    'orange',
    'lentilles',
    ...excludeNames,
  ]
  const uniqueBanned = [...new Set(banned.map((n) => n.toLowerCase()))]

  const system = `Tu es un professeur de SVT collège (6ème/5ème) en France.
Tu inventes un jeu de TRI d'aliments pour la leçon (bâtisseurs / énergétiques / fonctionnels).
Réponds UNIQUEMENT avec un JSON valide :
{
  "title": "Le Tri Express …",
  "description": "phrase courte",
  "items": [
    {
      "id": "slug",
      "name": "Nom aliment",
      "emoji": "🍞",
      "category": "batisseur|energetique|fonctionnel",
      "hint": "explication courte si erreur"
    }
  ]
}
Règles :
- exactement ${count} aliments DIFFÉRENTS
- INTERDIT d'utiliser ces aliments (déjà vus) : ${uniqueBanned.join(', ')}
- propose des aliments moins "classiques" : ex. sardine, quinoa, patate douce, cassis, amandes, haricots blancs, semoule, sardines, chou-fleur, melon, saumon, fromage blanc, pain complet remplacé par boulgour, etc.
- répartition équilibrée entre les 3 catégories (±1)
- category strictement : batisseur, energetique ou fonctionnel
- emoji alimentaire pertinent
- hints pédagogiques en français`

  const user = `Génère un NOUVEAU set d'aliments à trier (aucun doublon avec la liste interdite) pour :

Titre : ${lesson.title || 'Chapitre SVT'}
Niveau : ${lesson.level || 'collège'}

Contenu :
${lessonText}

Sois créatif : varité régionale / cantine / goûter / petit-déj, toujours collège SVT.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 1,
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

  const items = normalizeItems(parsed?.items, count, uniqueBanned)
  if (items.length < 6) {
    const err = new Error('Set de tri généré invalide')
    err.status = 502
    throw err
  }

  return {
    title: String(parsed?.title ?? 'Le Tri Express des Aliments').trim(),
    description: String(
      parsed?.description ??
        'Classe chaque aliment : Bâtisseurs, Énergétiques ou Fonctionnels.',
    ).trim(),
    items,
    model,
  }
}

/**
 * @param {unknown} raw
 * @param {number} count
 * @param {string[]} banned
 */
function normalizeItems(raw, count, banned = []) {
  if (!Array.isArray(raw)) return []
  const seen = new Set()
  const bannedSet = new Set(banned.map((n) => n.toLowerCase()))

  return raw
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null
      const row = /** @type {Record<string, unknown>} */ (item)
      const name = String(row.name ?? '').trim()
      const category = String(row.category ?? '').trim().toLowerCase()
      const emoji = String(row.emoji ?? '🍽️').trim() || '🍽️'
      const hint = String(row.hint ?? '').trim()
      if (!name || !CATEGORIES.has(category)) return null
      const key = name.toLowerCase()
      if (seen.has(key) || bannedSet.has(key)) return null
      // rejet partiel si le nom contient un aliment banni (ex. "pain complet")
      if ([...bannedSet].some((b) => b.length > 3 && key.includes(b))) return null
      seen.add(key)
      return {
        id: slug(String(row.id ?? `${category}-${index}-${name}`)),
        name,
        emoji,
        category,
        hint: hint || `Pense à la famille ${category} de la leçon.`,
      }
    })
    .filter(Boolean)
    .slice(0, count)
}

/** @param {object} lesson */
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

/** @param {number} value @param {number} min @param {number} max */
function clampInt(value, min, max) {
  const n = Number.parseInt(String(value), 10)
  if (Number.isNaN(n)) return min
  return Math.min(max, Math.max(min, n))
}
