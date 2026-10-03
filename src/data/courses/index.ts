import type { CourseModule } from '@/types/course'
import { nutritionCourse } from './nutrition'

/** Chapitres futurs — badges « Bientôt disponible » */
const upcoming = (
  id: string,
  title: string,
  level: CourseModule['level'],
  icon: string,
  shortDescription: string,
): CourseModule => ({
  ...nutritionCourse,
  id,
  title,
  level,
  icon,
  shortDescription,
  available: false,
  colorScheme: {
    primary: '#94A3B8',
    secondary: '#CBD5E1',
    accent: '#64748B',
    soft: '#F1F5F9',
  },
})

export const courses: CourseModule[] = [
  nutritionCourse,
  upcoming(
    'respiration-5e',
    'La respiration et l\'effort',
    '5ème',
    '🫁',
    'Comprendre les échanges gazeux pendant l\'effort physique.',
  ),
  upcoming(
    'reproduction-5e',
    'La reproduction des êtres vivants',
    '5ème',
    '🌱',
    'Du cycle de vie à la diversité des modes de reproduction.',
  ),
  upcoming(
    'ecosystemes-6e',
    'Le fonctionnement des écosystèmes',
    '6ème',
    '🌳',
    'Relations alimentaires et équilibre des milieux naturels.',
  ),
  upcoming(
    'terre-risques-5e',
    'La planète Terre et ses risques',
    '5ème',
    '🌍',
    'Séismes, volcans et prévention des risques naturels.',
  ),
]

export const getCourseById = (id: string): CourseModule =>
  courses.find((c) => c.id === id) ?? nutritionCourse
