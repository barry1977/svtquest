import { Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import type { CourseModule } from '@/types/course'

type Props = {
  courses: CourseModule[]
  activeId: string
  onSelect: (id: string) => void
}

export function ChapterSelector({ courses, activeId, onSelect }: Props) {
  return (
    <div className="scroll-snap-x hide-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
      {courses.map((course, index) => {
        const active = course.id === activeId
        return (
          <motion.button
            key={course.id}
            type="button"
            whileHover={course.available ? { y: -2 } : undefined}
            whileTap={course.available ? { scale: 0.98 } : undefined}
            onClick={() => course.available && onSelect(course.id)}
            disabled={!course.available}
            className={`scroll-snap-start relative flex w-[min(78vw,260px)] shrink-0 flex-col rounded-2xl border-2 px-3 py-3 text-left shadow-lg transition sm:w-[240px] sm:px-4 ${
              active
                ? 'border-mint bg-white shadow-mint/20'
                : course.available
                  ? 'border-white/80 bg-white/80 hover:border-mint/40'
                  : 'cursor-not-allowed border-slate-200 bg-slate-100/80 opacity-80'
            }`}
          >
            <div className="mb-1 flex flex-wrap items-center justify-between gap-1">
              <span className="text-[11px] font-800 uppercase tracking-wide text-ink-soft sm:text-xs">
                Chapitre {index + 1} · {course.level}
              </span>
              {!course.available && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-700 text-slate-600">
                  <Lock size={10} /> Bientôt
                </span>
              )}
            </div>
            <div className="flex items-start gap-2">
              <span className="text-2xl" aria-hidden>
                {course.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-800 leading-snug text-ink">{course.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-ink-soft">
                  {course.shortDescription}
                </p>
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
