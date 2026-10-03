import { Sparkles } from 'lucide-react'
import { ChapterSelector } from './ChapterSelector'
import { ProgressBar } from './ProgressBar'
import type { CourseModule } from '@/types/course'

type Props = {
  courses: CourseModule[]
  course: CourseModule
  onSelectCourse: (id: string) => void
  percent: number
  stars: number
  encouragement: string
}

export function Header({
  courses,
  course,
  onSelectCourse,
  percent,
  stars,
  encouragement,
}: Props) {
  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-mint-light px-3 py-1 text-xs font-800 uppercase tracking-wider text-mint-dark">
            <Sparkles size={14} />
            Édition Collège
          </div>
          <h1 className="text-2xl font-800 tracking-tight text-ink sm:text-4xl">
            SVT{' '}
            <span className="bg-gradient-to-r from-mint to-sky bg-clip-text text-transparent">
              Quest
            </span>
          </h1>
          <p className="mt-1 max-w-xl text-sm font-600 leading-snug text-ink-soft">
            <span className="block sm:inline">{course.title}</span>
            <span className="hidden sm:inline"> — </span>
            <span className="mt-0.5 block text-ink-soft/90 sm:mt-0 sm:inline">
              explore, manipule et révise pour ton contrôle.
            </span>
          </p>
        </div>
      </div>

      <ChapterSelector
        courses={courses}
        activeId={course.id}
        onSelect={onSelectCourse}
      />

      <ProgressBar
        percent={percent}
        stars={stars}
        encouragement={encouragement}
      />
    </header>
  )
}
