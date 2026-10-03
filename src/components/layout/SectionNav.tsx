import {
  BookOpen,
  Brain,
  FlaskConical,
  Gamepad2,
  Map,
  NotebookPen,
} from 'lucide-react'
import type { AppSection } from '@/types/course'

const ITEMS: {
  id: AppSection
  label: string
  short: string
  icon: typeof Map
}[] = [
  { id: 'summary', label: 'Résumé', short: 'Résumé', icon: BookOpen },
  { id: 'mindmap', label: 'Carte mentale', short: 'Carte', icon: Map },
  { id: 'schemas', label: 'Schémas', short: 'Schémas', icon: Brain },
  { id: 'lab', label: 'Labo TP', short: 'Labo', icon: FlaskConical },
  { id: 'games', label: 'Mini-jeux', short: 'Jeux', icon: Gamepad2 },
  { id: 'quiz', label: 'Révision', short: 'Quiz', icon: NotebookPen },
]

type Props = {
  active: AppSection
  onChange: (section: AppSection) => void
  visited: Set<AppSection>
}

export function SectionNav({ active, onChange, visited }: Props) {
  return (
    <>
      {/* Desktop / tablet */}
      <nav className="hidden gap-2 sm:grid sm:grid-cols-3 lg:grid-cols-6">
        {ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          const done = visited.has(id)
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl px-2 py-3 text-sm font-700 shadow-md transition lg:px-3 ${
                isActive
                  ? 'bg-mint text-white shadow-mint/30'
                  : 'bg-white text-ink hover:bg-mint-light'
              }`}
            >
              <Icon size={18} />
              <span className="truncate">{label}</span>
              {done && !isActive && (
                <span className="ml-0.5 h-2 w-2 shrink-0 rounded-full bg-tangerine" title="Visité" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Mobile bottom bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-mint/20 bg-white/95 px-1 pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md safe-bottom-nav sm:hidden"
        aria-label="Navigation principale"
      >
        <div className="mx-auto grid max-w-lg grid-cols-6 gap-0.5">
          {ITEMS.map(({ id, short, icon: Icon }) => {
            const isActive = active === id
            const done = visited.has(id)
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange(id)}
                className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1 text-[9px] font-800 transition ${
                  isActive ? 'bg-mint text-white' : 'text-ink-soft'
                }`}
              >
                <Icon size={18} />
                <span className="leading-tight">{short}</span>
                {done && !isActive && (
                  <span className="absolute right-0.5 top-1 h-1.5 w-1.5 rounded-full bg-tangerine" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
