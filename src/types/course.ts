export type Level = '6ème' | '5ème'

export type ColorScheme = {
  primary: string
  secondary: string
  accent: string
  soft: string
}

export type MindMapQuizOption = {
  id: string
  label: string
  correct: boolean
}

export type MindMapNode = {
  id: string
  label: string
  description: string
  icon?: string
  children?: MindMapNode[]
  quiz?: {
    prompt: string
    options: MindMapQuizOption[]
  }
}

export type SchemaControl = {
  id: string
  label: string
  type: 'slider' | 'toggle'
  min?: number
  max?: number
  step?: number
  defaultValue: number
  leftLabel?: string
  rightLabel?: string
}

export type PyramidFood = {
  emoji: string
  name: string
}

export type SchemaDefinition = {
  id: string
  title: string
  subtitle: string
  kind: 'reactor' | 'digestion' | 'pyramid'
  legend: string
  controls?: SchemaControl[]
  steps?: { title: string; description: string }[]
  tiers?: {
    id: string
    label: string
    frequency: string
    role: string
    family: 'Bâtisseur' | 'Énergétique' | 'Fonctionnel' | 'Base'
    color: string
    foods?: PyramidFood[]
  }[]
}

export type LabSample = {
  id: string
  name: string
  emoji: string
}

export type LabReagent = {
  id: string
  name: string
  description: string
  testsFor: string
}

export type LabExperiment = {
  id: string
  sampleId: string
  reagentId: string
  observation: string
  interpretation: string
  resultColor: string
  visualHint: string
}

export type LabCompetence = {
  code: string
  title: string
  description: string
}

export type LabProtocolStep = {
  title: string
  description: string
}

export type LabChallengeOption = {
  id: string
  label: string
  correct: boolean
}

export type LabChallenge = {
  title: string
  prompt: string
  options: LabChallengeOption[]
  successMessage: string
}

export type LabPractical = {
  title: string
  problem: string
  /** Accroche ludique type « mission » */
  missionBrief?: string
  /** Étapes du protocole à suivre */
  steps?: LabProtocolStep[]
  samples: LabSample[]
  reagents: LabReagent[]
  experiments: LabExperiment[]
  conclusion: string
  competences: LabCompetence[]
  /** Mini-défi final après les manip' */
  challenge?: LabChallenge
}

export type FoodCategory = 'batisseur' | 'energetique' | 'fonctionnel'

export type SortGameItem = {
  id: string
  name: string
  emoji: string
  category: FoodCategory
  hint: string
}

export type PlateIngredient = {
  id: string
  name: string
  emoji: string
  category: FoodCategory
  points: number
}

export type MiniGameConfig =
  | {
      id: string
      type: 'sort'
      title: string
      description: string
      items: SortGameItem[]
    }
  | {
      id: string
      type: 'plate'
      title: string
      description: string
      ingredients: PlateIngredient[]
      tips: string[]
    }

export type SummaryKeyPoint = {
  id: string
  icon: string
  title: string
  text: string
  color: string
}

export type CourseSummary = {
  heroTitle: string
  heroSubtitle: string
  objectives: string[]
  keyPoints: SummaryKeyPoint[]
  remember: string[]
  roadmap: { section: AppSection; label: string; blurb: string }[]
}

export type Flashcard = {
  id: string
  term: string
  definition: string
  color: string
}

export type QuizQuestion = {
  id: string
  question: string
  choices: string[]
  correctIndex: number
  explanation: string
  tipOnError: string
}

export type CourseModule = {
  id: string
  title: string
  level: Level
  icon: string
  shortDescription: string
  colorScheme: ColorScheme
  available: boolean
  summary: CourseSummary
  schemas: SchemaDefinition[]
  mindmap: MindMapNode
  labPractical: LabPractical
  miniGames: MiniGameConfig[]
  flashcards: Flashcard[]
  quiz: QuizQuestion[]
}

export type AppSection =
  | 'summary'
  | 'mindmap'
  | 'schemas'
  | 'lab'
  | 'games'
  | 'quiz'
