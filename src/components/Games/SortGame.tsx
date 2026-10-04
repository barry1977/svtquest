import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { CourseModule, FoodCategory, SortGameItem } from '@/types/course'
import { celebrateSuccess } from '@/lib/confetti'
import { buildLessonContext } from '@/lib/lessonContext'
import { fetchQuizApiConfig, generateSortGame } from '@/lib/quizApi'
import { pickSortRound } from '@/lib/sortDeck'

const BINS: { id: FoodCategory; label: string; emoji: string; color: string }[] = [
  { id: 'batisseur', label: 'Bâtisseurs', emoji: '🧱', color: '#8B5CF6' },
  { id: 'energetique', label: 'Énergétiques', emoji: '⚡', color: '#F97316' },
  { id: 'fonctionnel', label: 'Fonctionnels', emoji: '🛡️', color: '#10B981' },
]

const ROUND_SIZE = 9
const RECENT_MEMORY = 18

type Props = {
  title: string
  description: string
  items: SortGameItem[]
  course?: CourseModule
  onStar?: () => void
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function SortGame({ title, description, items, course, onStar }: Props) {
  const [masterPool, setMasterPool] = useState(items)
  const [deck, setDeck] = useState<SortGameItem[]>(() =>
    pickSortRound(items, ROUND_SIZE, []),
  )
  const [recentNames, setRecentNames] = useState<string[]>([])
  const [gameTitle, setGameTitle] = useState(title)
  const [gameDescription, setGameDescription] = useState(description)
  const [roundKey, setRoundKey] = useState(0)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [flash, setFlash] = useState<'ok' | 'ko' | null>(null)
  const [done, setDone] = useState(false)
  const [generationEnabled, setGenerationEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<'cours' | 'ia'>('cours')

  const startRound = (
    pool: SortGameItem[],
    recent: string[],
    nextSource: 'cours' | 'ia' = source,
  ) => {
    const nextDeck = pickSortRound(pool, ROUND_SIZE, recent)
    const played = nextDeck.map((d) => d.name)
    setDeck(nextDeck)
    setRecentNames((prev) => [...played, ...prev].slice(0, RECENT_MEMORY))
    setSource(nextSource)
    setRoundKey((k) => k + 1)
    setIndex(0)
    setScore(0)
    setMessage(null)
    setDone(false)
    setFlash(null)
    setError(null)
  }

  useEffect(() => {
    setMasterPool(items)
    setGameTitle(title)
    setGameDescription(description)
    setRecentNames([])
    startRound(items, [], 'cours')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when course pool changes
  }, [items, title, description])

  useEffect(() => {
    let cancelled = false
    fetchQuizApiConfig()
      .then((config) => {
        if (!cancelled) setGenerationEnabled(config.quizGenerationEnabled)
      })
      .catch(() => {
        if (!cancelled) setGenerationEnabled(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const bins = useMemo(() => shuffle(BINS), [roundKey])
  const current = deck[index]

  const drop = (category: FoodCategory) => {
    // Ignore les clics pendant le feedback (évite double confetti / flash)
    if (!current || done || flash) return
    const correct = current.category === category
    if (correct) {
      setScore((s) => s + 1)
      setFlash('ok')
      setMessage(
        `Oui ! ${current.emoji} ${current.name} est bien un aliment ${
          BINS.find((b) => b.id === category)?.label.toLowerCase() ?? category
        }.`,
      )
      onStar?.()
    } else {
      setFlash('ko')
      setMessage(current.hint)
    }

    window.setTimeout(() => {
      setFlash(null)
      if (index + 1 >= deck.length) {
        setDone(true)
        // Confetti en fin de manche seulement (évite le flash noir à chaque bonne réponse)
        celebrateSuccess()
      } else {
        setIndex((i) => i + 1)
        setMessage(null)
      }
    }, 900)
  }

  const handleGenerate = async () => {
    if (!course) return
    setLoading(true)
    setError(null)
    try {
      const next = await generateSortGame(
        buildLessonContext(course),
        ROUND_SIZE,
        recentNames,
      )
      // Fusionne dans le pool pour enrichir les prochaines parties locales
      setMasterPool((prev) => mergePools(prev, next.items))
      setGameTitle(next.title)
      setGameDescription(next.description)
      startRound(next.items, recentNames, 'ia')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de générer un nouveau tri.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResetCourse = () => {
    setMasterPool(items)
    setGameTitle(title)
    setGameDescription(description)
    startRound(items, recentNames, 'cours')
  }

  return (
    <div className="space-y-4 rounded-2xl border-2 border-tangerine/20 bg-white p-4 shadow-lg sm:p-5">
      <div>
        <h3 className="text-lg font-800 text-ink">{gameTitle}</h3>
        <p className="text-sm text-ink-soft">{gameDescription}</p>
        <p className="mt-1 text-xs font-700 text-ink-soft">
          Tour de {deck.length} aliments tirés parmi {masterPool.length} — les
          récents sont évités.
        </p>
      </div>

      {course && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!generationEnabled || loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-tangerine px-3 py-2 text-sm font-800 text-white shadow-md transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            title={
              generationEnabled
                ? 'Tirer d’autres aliments pour ce tour'
                : 'Génération indisponible pour le moment'
            }
          >
            <Sparkles size={16} />
            {loading ? 'Génération…' : 'Nouveaux aliments'}
          </button>
          {source === 'ia' && (
            <button
              type="button"
              onClick={handleResetCourse}
              className="rounded-2xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-800 text-ink hover:bg-slate-50"
            >
              Aliments du cours
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-tangerine/30 bg-tangerine-light px-3 py-2 text-sm font-700 text-tangerine-dark">
          {error}
        </p>
      )}

      {!done && current && (
        <>
          <div className="relative flex h-40 items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${roundKey}-${current.id}`}
                initial={{ y: -24, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  scale: flash === 'ok' ? 1.05 : flash === 'ko' ? 0.97 : 1,
                  boxShadow:
                    flash === 'ok'
                      ? '0 0 0 4px rgba(16,185,129,0.45)'
                      : flash === 'ko'
                        ? '0 0 0 4px rgba(249,115,22,0.35)'
                        : '0 10px 15px -3px rgba(0,0,0,0.1)',
                }}
                exit={{ y: 16, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className={`flex h-36 w-36 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-tangerine-light to-white ${
                  flash === 'ok' ? 'ring-2 ring-mint' : ''
                }`}
              >
                <span className="emoji text-5xl">{current.emoji}</span>
                <span className="mt-2 font-800">{current.name}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="text-center text-xs font-700 text-ink-soft">
            Carte {index + 1} / {deck.length} — Score {score}
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
            {bins.map((bin) => (
              <button
                key={`${roundKey}-${bin.id}`}
                type="button"
                disabled={Boolean(flash)}
                onClick={() => drop(bin.id)}
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-800 text-white shadow-md transition enabled:hover:brightness-110 disabled:cursor-default disabled:opacity-80 sm:flex-col sm:py-4"
                style={{ backgroundColor: bin.color }}
              >
                <span className="text-2xl">{bin.emoji}</span>
                <span className="sm:mt-1">{bin.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {message && (
        <p
          className={`rounded-xl px-3 py-2 text-sm font-700 ${
            flash === 'ko'
              ? 'bg-tangerine-light text-tangerine-dark'
              : 'bg-mint-light text-mint-dark'
          }`}
        >
          {message}
        </p>
      )}

      {done && (
        <div className="rounded-2xl bg-mint-light p-4 text-center">
          <p className="text-lg font-800 text-mint-dark">
            Terminé ! {score}/{deck.length} bonnes réponses
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => startRound(masterPool, recentNames, source)}
              className="rounded-xl bg-mint px-4 py-2 text-sm font-800 text-white"
            >
              Rejouer (autres aliments)
            </button>
            {course && generationEnabled && (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center gap-1 rounded-xl bg-tangerine px-4 py-2 text-sm font-800 text-white disabled:opacity-50"
              >
                <Sparkles size={14} />
                {loading ? 'Génération…' : 'Autres aliments'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function mergePools(base: SortGameItem[], extra: SortGameItem[]): SortGameItem[] {
  const map = new Map<string, SortGameItem>()
  for (const item of [...base, ...extra]) {
    map.set(item.name.toLowerCase(), item)
  }
  return [...map.values()]
}
