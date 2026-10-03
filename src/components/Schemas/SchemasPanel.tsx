import { useState } from 'react'
import type { SchemaDefinition } from '@/types/course'
import { ReactorSchema } from './ReactorSchema'
import { DigestionSchema } from './DigestionSchema'
import { PyramidSchema } from './PyramidSchema'

type Props = {
  schemas: SchemaDefinition[]
}

export function SchemasPanel({ schemas }: Props) {
  const [activeId, setActiveId] = useState(schemas[0]?.id)
  const active = schemas.find((s) => s.id === activeId) ?? schemas[0]

  if (!active) return null

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-800 text-ink">Schémas animés & didactiques</h2>
        <p className="text-sm text-ink-soft">
          Explore trois visualisations interactives du chapitre.
        </p>
      </div>

      <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
        {schemas.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveId(s.id)}
            className={`min-h-11 shrink-0 rounded-2xl px-3 py-2 text-sm font-700 shadow-md transition sm:px-4 ${
              activeId === s.id
                ? 'bg-sky text-white'
                : 'bg-white text-ink hover:bg-sky-light'
            }`}
          >
            <span className="sm:hidden">
              {String.fromCharCode(65 + i)} · {s.title.split(' ').slice(0, 2).join(' ')}
            </span>
            <span className="hidden sm:inline">
              Schéma {String.fromCharCode(65 + i)} · {s.title.split(' ').slice(0, 3).join(' ')}
            </span>
          </button>
        ))}
      </div>

      <div>
        <h3 className="text-base font-800 text-ink sm:text-lg">{active.title}</h3>
        <p className="mb-4 text-sm text-ink-soft">{active.subtitle}</p>

        {active.kind === 'reactor' && <ReactorSchema schema={active} />}
        {active.kind === 'digestion' && <DigestionSchema schema={active} />}
        {active.kind === 'pyramid' && <PyramidSchema schema={active} />}
      </div>
    </div>
  )
}
