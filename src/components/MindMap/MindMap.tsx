import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, HelpCircle, Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
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

type ViewBox = { x: number; y: number; w: number; h: number }

const BRANCH_COLORS = ['#F97316', '#0284C7', '#8B5CF6', '#10B981']
const VIEW_PAD = 36

/** Découpe un libellé pour qu’il tienne dans un cercle SVG. */
function wrapLabel(
  label: string,
  maxCharsPerLine: number,
  maxLines: number,
): string[] {
  const words = label.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return []

  const lines: string[] = []
  let current = ''

  const pushTruncated = (text: string) => {
    if (text.length <= maxCharsPerLine) return text
    return `${text.slice(0, Math.max(1, maxCharsPerLine - 1))}…`
  }

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const trial = current ? `${current} ${word}` : word
    if (trial.length <= maxCharsPerLine) {
      current = trial
      continue
    }
    if (current) lines.push(current)
    if (lines.length >= maxLines - 1) {
      const rest = words.slice(i).join(' ')
      lines.push(pushTruncated(rest))
      return lines
    }
    current = word.length > maxCharsPerLine ? pushTruncated(word) : word
  }
  if (current) lines.push(current)
  return lines.slice(0, maxLines)
}

function nodeRadius(depth: number): number {
  if (depth === 0) return 64
  if (depth === 1) return 46
  return 36
}

function labelLayout(depth: number, hasIcon: boolean) {
  const r = nodeRadius(depth)
  const fontSize = depth === 0 ? 10.5 : depth === 1 ? 9.5 : 9
  const maxLines = depth === 0 ? 3 : hasIcon ? 2 : 3
  const maxChars = Math.max(8, Math.floor((r * 1.5) / (fontSize * 0.58)))
  const lineHeight = fontSize + 2
  return { r, fontSize, maxLines, maxChars, lineHeight }
}

function layoutMindMap(root: MindMapNode): {
  nodes: FlatNode[]
  fitView: ViewBox
} {
  const raw: FlatNode[] = []

  // Coordonnées relatives centrées en (0,0)
  raw.push({ node: root, x: 0, y: 0, depth: 0, branchIndex: 0 })

  const branches = root.children ?? []
  branches.forEach((branch, bi) => {
    const angle = -Math.PI / 2 + (bi * (2 * Math.PI)) / Math.max(branches.length, 1)
    // Distances compactes pour tout garder dans le cadre
    const bx = Math.cos(angle) * 195
    const by = Math.sin(angle) * 145
    raw.push({
      node: branch,
      x: bx,
      y: by,
      parentId: root.id,
      depth: 1,
      branchIndex: bi,
    })

    const kids = branch.children ?? []
    kids.forEach((child, ci) => {
      const spread = (ci - (kids.length - 1) / 2) * 0.4
      const childAngle = angle + spread
      const dist = 138 + (ci % 2) * 12
      raw.push({
        node: child,
        x: bx + Math.cos(childAngle) * dist,
        y: by + Math.sin(childAngle) * dist * 0.9,
        parentId: branch.id,
        depth: 2,
        branchIndex: bi,
      })
    })
  })

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const f of raw) {
    const r = nodeRadius(f.depth) + 8
    minX = Math.min(minX, f.x - r)
    minY = Math.min(minY, f.y - r)
    maxX = Math.max(maxX, f.x + r)
    maxY = Math.max(maxY, f.y + r)
  }

  const fitView: ViewBox = {
    x: minX - VIEW_PAD,
    y: minY - VIEW_PAD,
    w: maxX - minX + VIEW_PAD * 2,
    h: maxY - minY + VIEW_PAD * 2,
  }

  return { nodes: raw, fitView }
}

function viewBoxString(v: ViewBox): string {
  return `${v.x} ${v.y} ${v.w} ${v.h}`
}

function zoomViewBox(fit: ViewBox, zoom: number, pan: { x: number; y: number }): ViewBox {
  // zoom > 1 = plus près ; pan en fraction de la view
  const w = fit.w / zoom
  const h = fit.h / zoom
  const cx = fit.x + fit.w / 2 + pan.x
  const cy = fit.y + fit.h / 2 + pan.y
  return {
    x: cx - w / 2,
    y: cy - h / 2,
    w,
    h,
  }
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
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{
    x: number
    y: number
    px: number
    py: number
  } | null>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  const { nodes: flat, fitView } = useMemo(() => layoutMindMap(root), [root])
  const byId = useMemo(() => new Map(flat.map((f) => [f.node.id, f])), [flat])
  const selected = selectedId ? byId.get(selectedId)?.node : null
  const quizNode = quizNodeId ? byId.get(quizNodeId)?.node : null

  const currentView = useMemo(
    () => zoomViewBox(fitView, zoom, pan),
    [fitView, zoom, pan],
  )

  const resetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    resetView()
  }, [root, resetView])

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
    if (!dragRef.current || !frameRef.current) return
    const rect = frameRef.current.getBoundingClientRect()
    // Convertir le drag écran → unités viewBox
    const dx =
      ((e.clientX - dragRef.current.x) / Math.max(rect.width, 1)) * currentView.w
    const dy =
      ((e.clientY - dragRef.current.y) / Math.max(rect.height, 1)) * currentView.h
    setPan({
      x: dragRef.current.px - dx,
      y: dragRef.current.py - dy,
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
            Toute la carte est visible dans le cadre — zoome ou glisse si besoin.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.4, Number((z + 0.15).toFixed(2))))}
            className="touch-target rounded-xl bg-white p-2 shadow-md hover:bg-mint-light"
            aria-label="Zoom avant"
          >
            <ZoomIn size={18} />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.85, Number((z - 0.15).toFixed(2))))}
            className="touch-target rounded-xl bg-white p-2 shadow-md hover:bg-mint-light"
            aria-label="Zoom arrière"
          >
            <ZoomOut size={18} />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="touch-target rounded-xl bg-white p-2 shadow-md hover:bg-mint-light"
            aria-label="Recadrer toute la carte"
            title="Tout voir"
          >
            <Maximize2 size={18} />
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
          ref={frameRef}
          className="relative h-[min(62svh,420px)] cursor-grab overflow-hidden rounded-2xl border-2 border-white bg-gradient-to-br from-mint-light/40 via-white to-sky-light/50 shadow-lg active:cursor-grabbing sm:h-[500px] lg:h-[540px]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <svg
            viewBox={viewBoxString(currentView)}
            className="h-full w-full touch-none"
            preserveAspectRatio="xMidYMid meet"
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
              const hasIcon = Boolean(f.node.icon) && !hidden
              const { r, fontSize, maxLines, maxChars, lineHeight } = labelLayout(
                f.depth,
                hasIcon,
              )
              const active = selectedId === f.node.id
              const lines = wrapLabel(f.node.label, maxChars, maxLines)
              const blockHeight = lines.length * lineHeight
              const textBlockTop = hasIcon
                ? 2
                : -blockHeight / 2 + lineHeight * 0.35
              const iconY = hasIcon ? (isRoot ? -16 : -12) : 0

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
                    r={r + (active ? 3 : 0)}
                    fill={hidden ? '#E2E8F0' : 'white'}
                    stroke={hidden ? '#94A3B8' : color}
                    strokeWidth={active ? 5 : 3}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    filter="url(#shadow)"
                  />
                  <clipPath id={`clip-${f.node.id}`}>
                    <circle r={r - 4} />
                  </clipPath>
                  <g clipPath={`url(#clip-${f.node.id})`}>
                    {hasIcon && (
                      <text
                        textAnchor="middle"
                        y={iconY}
                        fontSize={isRoot ? 18 : 15}
                        style={{
                          fontFamily:
                            '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
                        }}
                      >
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
                        fontSize={fontSize}
                        fontWeight={800}
                        fill="#1E293B"
                      >
                        {lines.map((line, i) => (
                          <tspan
                            key={`${f.node.id}-l-${i}`}
                            x={0}
                            y={textBlockTop + i * lineHeight}
                          >
                            {line}
                          </tspan>
                        ))}
                      </text>
                    )}
                  </g>
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
