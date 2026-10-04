import type { CourseModule, MiniGameConfig } from '@/types/course'
import { SortGame } from './SortGame'
import { PlateGame } from './PlateGame'

type Props = {
  course: CourseModule
  games: MiniGameConfig[]
  onStar?: () => void
}

export function GamesPanel({ course, games, onStar }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-800 text-ink">Bac à sable & mini-jeux</h2>
        <p className="text-sm text-ink-soft">
          Entraîne-toi en t&apos;amusant : tri express et assiette idéale.
        </p>
      </div>

      {games.map((game) => {
        if (game.type === 'sort') {
          return (
            <SortGame
              key={game.id}
              title={game.title}
              description={game.description}
              items={game.items}
              course={course}
              onStar={onStar}
            />
          )
        }
        return (
          <PlateGame
            key={game.id}
            title={game.title}
            description={game.description}
            ingredients={game.ingredients}
            tips={game.tips}
            onStar={onStar}
          />
        )
      })}
    </div>
  )
}
