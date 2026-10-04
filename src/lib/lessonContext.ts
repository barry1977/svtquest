import type { CourseModule, MindMapNode } from '@/types/course'

export type LessonContextPayload = {
  title: string
  level: string
  objectives: string[]
  keyPoints: string[]
  remember: string[]
  flashcards: string[]
}

/** Extrait un résumé pédagogique sûr à envoyer au proxy (sans secrets). */
export function buildLessonContext(course: CourseModule): LessonContextPayload {
  return {
    title: course.title,
    level: course.level,
    objectives: course.summary.objectives,
    keyPoints: course.summary.keyPoints.map((k) => `${k.title} : ${k.text}`),
    remember: course.summary.remember,
    flashcards: [
      ...course.flashcards.map((f) => `${f.term} : ${f.definition}`),
      ...flattenMindMap(course.mindmap).slice(0, 24),
    ],
  }
}

function flattenMindMap(node: MindMapNode, depth = 0): string[] {
  const line = `${'  '.repeat(depth)}${node.label} — ${node.description}`
  const children = node.children?.flatMap((child) => flattenMindMap(child, depth + 1)) ?? []
  return [line, ...children]
}
