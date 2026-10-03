import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { courses, getCourseById } from '@/data/courses'
import { useProgress } from '@/hooks/useProgress'
import type { AppSection } from '@/types/course'
import { Header } from '@/components/layout/Header'
import { SectionNav } from '@/components/layout/SectionNav'
import { SummaryPanel } from '@/components/Summary/SummaryPanel'
import { MindMap } from '@/components/MindMap/MindMap'
import { SchemasPanel } from '@/components/Schemas/SchemasPanel'
import { LabBench } from '@/components/Lab/LabBench'
import { GamesPanel } from '@/components/Games/GamesPanel'
import { QuizPanel } from '@/components/Quiz/QuizPanel'

export default function App() {
  const [courseId, setCourseId] = useState('nutrition-6e')
  const [section, setSection] = useState<AppSection>('summary')
  const course = getCourseById(courseId)
  const { visited, stars, progressPercent, encouragement, markVisited, addStars } =
    useProgress()

  useEffect(() => {
    markVisited(section)
  }, [section, markVisited])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [section])

  return (
    <div className="safe-px mx-auto min-h-dvh max-w-6xl px-3 pb-24 pt-4 sm:px-6 sm:pb-8 sm:pt-8">
      <Header
        courses={courses}
        course={course}
        onSelectCourse={setCourseId}
        percent={progressPercent}
        stars={stars}
        encouragement={encouragement}
      />

      <div className="mt-4 sm:mt-5">
        <SectionNav
          active={section}
          onChange={setSection}
          visited={visited}
        />
      </div>

      <main className="glass-panel mt-4 overflow-hidden rounded-2xl p-3 shadow-lg sm:mt-5 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${course.id}-${section}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {section === 'summary' && (
              <SummaryPanel
                summary={course.summary}
                level={course.level}
                icon={course.icon}
                onNavigate={setSection}
              />
            )}
            {section === 'mindmap' && (
              <MindMap root={course.mindmap} onStar={() => addStars(1)} />
            )}
            {section === 'schemas' && <SchemasPanel schemas={course.schemas} />}
            {section === 'lab' && (
              <LabBench lab={course.labPractical} onStar={() => addStars(1)} />
            )}
            {section === 'games' && (
              <GamesPanel games={course.miniGames} onStar={() => addStars(1)} />
            )}
            {section === 'quiz' && (
              <QuizPanel
                flashcards={course.flashcards}
                quiz={course.quiz}
                onStar={() => addStars(1)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mt-6 safe-pb pb-2 text-center text-xs font-600 text-ink-soft sm:pb-4">
        <span className="block sm:inline">SVT Quest · Course Engine</span>
        <span className="hidden sm:inline"> · </span>
        <span className="mt-1 block sm:mt-0 sm:inline">
          Chapitre : {course.title}
        </span>
      </footer>
    </div>
  )
}
