import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, HelpCircle, ZoomIn, ZoomOut } from 'lucide-react'
import type { MindMapNode } from '@/types/course'
import { celebrateSuccess } from '@/lib/confetti'

type FlatNode = {
  node: MindMapNode
  x: number
  y: number
  parentId?: string
  depth: number
  branchIndex: number
}

const BRANCH_COLORS = ['#F97316', '#0284C7', '#8B5CF6', '#10B981']

function flattenMindMap(root: MindMapNode): FlatNode[] {
  const result: FlatNode[] = []
  const W = 1000
  const H = 620
  const cx = W / 2
  const cy = H / 2

  result.push({ node: root, x: cx, y: cy, depth: 0, branchIndex: 0 })

  const branches = root.children ?? []
  branches.forEach((branch, bi) => {
    const angle = (-Math.PI / 2) + (bi * (2 * Math.PI)) / branches.length
    const bx = cx + Math.cos(angle) * 210
    const by = cy + Math.sin(angle) * 155
    result.push({
      node: branch,
      x: bx,
      y: by,
      parentId: root.id,
      depth: 1,
      branchIndex: bi,
    })

    const kids = branch.children ?? []
    kids.forEach((child, ci) => {
      const spread = (ci - (kids.length - 1) / 2) * 0.42
      const childAngle = angle + spread
      const dist = 155 + (ci % 2) * 18
      result.push({
        node: child,
        x: bx + Math.cos(childAngle) * dist,
        y: by + Math.sin(childAngle) * dist * 0.85,
        parentId: branch.id,
        depth: 2,
        branchIndex: bi,
      })
    })
  })

  return result
}

type Props = {
  root: MindMapNode
  onStar?: () => void
}

export function MindMap({ root, onStar }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(root.id)
  const [challengeMode, setChallengeMode] = useState(false)
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set())
  const [quizNodeId, setQuizNodeId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null,
  )

  useEffect(() => {
    const apply = () => {
      const w = window.innerWidth
      if (w < 480) setScale(0.72)
      else if (w < 768) setScale(0.85)
      else setScale(1)
      setPan({ x: 0, y: 0 })
    }
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])

  const flat = useMemo(() => flattenMindMap(root), [root])
  const byId = useMemo(() => new Map(flat.map((f) => [f.node.id, f])), [flat])
  const selected = selectedId ? byId.get(selectedId)?.node : null
  const quizNode = quizNodeId ? byId.get(quizNodeId)?.node : null

  const quizzableIds = useMemo(
    () => new Set(flat.filter((f) => f.node.quiz).map((f) => f.node.id)),
    [flat],
  )

  const isHidden = useCallback(
    (id: string) =>
      challengeMode && quizzableIds.has(id) && !unlocked.has(id),
    [challengeMode, quizzableIds, unlocked],
  )

  const handleNodeClick = (id: string) => {
    if (isHidden(id)) {
      setQuizNodeId(id)
      setFeedback(null)
      return
    }
    setSelectedId(id)
    setQuizNodeId(null)
  }

  const answerQuiz = (correct: boolean, label: string) => {
    if (!quizNodeId) return
    if (correct) {
      setUnlocked((prev) => new Set(prev).add(quizNodeId))
      setSelectedId(quizNodeId)
      setFeedback(`Bravo ! « ${label} » est la bonne réponse.`)
      celebrateSuccess()
      onStar?.()
      setTimeout(() => setQuizNodeId(null), 900)
    } else {
      setFeedback(`Pas tout à fait… Relis bien les indices et réessaie !`)
    }
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      px: pan.x,
      py: pan.y,
    }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    setPan({
      x: dragRef.current.px + (e.clientX - dragRef.current.x),
      y: dragRef.current.py + (e.clientY - dragRef.current.y),
    })
  }

  const onPointerUp = () => {
    dragRef.current = null
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-800 text-ink sm:text-xl">Carte mentale interactive</h2>
          <p className="text-sm text-ink-soft">
            Touche un nœud, zoome, glisse, puis active le Défi Contrôle.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(1.6, s + 0.1))}
            className="touch-target rounded-xl bg-white p-2 shadow-md hover:bg-mint-light"
            aria-label="Zoom avant"
          >
            <ZoomIn size={18} />
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.55, s - 0.1))}
            className="touch-target rounded-xl bg-white p-2 shadow-md hover:bg-mint-light"
            aria-label="Zoom arrière"
          >
            <ZoomOut size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              setChallengeMode((v) => !v)
              setQuizNodeId(null)
              setFeedback(null)
            }}
            className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-700 shadow-md sm:flex-none sm:px-4 ${
              challengeMode
                ? 'bg-violet-soft text-white'
                : 'bg-white text-ink hover:bg-violet-light'
            }`}
          >
            {challengeMode ? <Eye size={16} /> : <EyeOff size={16} />}
            <span className="sm:hidden">Défi</span>
            <span className="hidden sm:inline">Mode Défi Contrôle</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div
          className="relative h-[min(58svh,360px)] cursor-grab overflow-hidden rounded-2xl border-2 border-white bg-gradient-to-br from-mint-light/40 via-white to-sky-light/50 shadow-lg active:cursor-grabbing sm:h-[480px] lg:h-[520px]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <svg
            viewBox="0 0 1000 620"
            className="h-full w-full touch-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            {flat
              .filter((f) => f.parentId)
              .map((f) => {
                const parent = byId.get(f.parentId!)
                if (!parent) return null
                return (
                  <line
                    key={`e-${f.node.id}`}
                    x1={parent.x}
                    y1={parent.y}
                    x2={f.x}
                    y2={f.y}
                    stroke={BRANCH_COLORS[f.branchIndex % BRANCH_COLORS.length]}
                    strokeWidth={f.depth === 1 ? 4 : 2.5}
                    strokeLinecap="round"
                    opacity={0.55}
                  />
                )
              })}

            {flat.map((f) => {
              const hidden = isHidden(f.node.id)
              const isRoot = f.depth === 0
              const color = isRoot
                ? '#10B981'
                : BRANCH_COLORS[f.branchIndex % BRANCH_COLORS.length]
              const r = isRoot ? 58 : f.depth === 1 ? 44 : 34
              const active = selectedId === f.node.id

              return (
                <g
                  key={f.node.id}
                  transform={`translate(${f.x}, ${f.y})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNodeClick(f.node.id)
                  }}
                >
                  <motion.circle
                    r={r + (active ? 4 : 0)}
                    fill={hidden ? '#E2E8F0' : 'white'}
                    stroke={hidden ? '#94A3B8' : color}
                    strokeWidth={active ? 5 : 3}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    filter="url(#shadow)"
                  />
                  {!hidden && f.node.icon && (
                    <text textAnchor="middle" y={-6} fontSize={isRoot ? 22 : 18}>
                      {f.node.icon}
                    </text>
                  )}
                  {hidden ? (
                    <text
                      textAnchor="middle"
                      y={6}
                      fontSize={22}
                      fill="#64748B"
                      fontWeight={800}
                    >
                      ?
                    </text>
                  ) : (
                    <text
                      textAnchor="middle"
                      y={isRoot ? 18 : f.node.icon ? 16 : 5}
                      fontSize={isRoot ? 11 : 10}
                      fontWeight={800}
                      fill="#1E293B"
                    >
                      {f.node.label.length > 18
                        ? `${f.node.label.slice(0, 16)}…`
                        : f.node.label}
                    </text>
                  )}
                </g>
              )
            })}

            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
              </filter>
            </defs>
          </svg>

          {challengeMode && (
            <div className="pointer-events-none absolute left-2 top-2 inline-flex max-w-[90%] items-center gap-1 rounded-full bg-violet-soft/90 px-2.5 py-1 text-[11px] font-700 text-white sm:left-3 sm:top-3 sm:text-xs">
              <HelpCircle size={14} className="shrink-0" />
              <span className="truncate">Touche les « ? » pour débloquer</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {selected && !quizNode && (
              <motion.aside
                key={selected.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="rounded-2xl border-2 border-mint/30 bg-white p-4 shadow-lg"
              >
                <p className="text-xs font-800 uppercase tracking-wide text-mint-dark">
                  Encadré explicatif
                </p>
                <h3 className="mt-1 text-lg font-800 text-ink">
                  {selected.icon} {selected.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {selected.description}
                </p>
              </motion.aside>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {quizNode?.quiz && (
              <motion.aside
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border-2 border-violet-soft/40 bg-violet-light p-4 shadow-lg"
              >
                <p className="text-xs font-800 uppercase text-violet-dark">
                  Défi Contrôle
                </p>
                <h3 className="mt-1 font-800 text-ink">{quizNode.quiz.prompt}</h3>
                <div className="mt-3 space-y-2">
                  {quizNode.quiz.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => answerQuiz(opt.correct, opt.label)}
                      className="w-full rounded-xl bg-white px-3 py-2 text-left text-sm font-700 text-ink shadow-sm hover:bg-mint-light"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {feedback && (
                  <p className="mt-3 text-sm font-700 text-violet-dark">{feedback}</p>
                )}
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
