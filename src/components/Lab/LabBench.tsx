import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Beaker, CheckCircle2, ClipboardCheck, Pipette } from 'lucide-react'
import type { LabPractical } from '@/types/course'
import { celebrateSuccess } from '@/lib/confetti'

type Props = {
  lab: LabPractical
  onStar?: () => void
}

type CellEntry = {
  observation: string
  interpretation: string
}

export function LabBench({ lab, onStar }: Props) {
  const [sampleId, setSampleId] = useState(lab.samples[0]?.id ?? '')
  const [reagentId, setReagentId] = useState(lab.reagents[0]?.id ?? '')
  const [pouring, setPouring] = useState(false)
  const [lastResultId, setLastResultId] = useState<string | null>(null)
  const [showCorrection, setShowCorrection] = useState(false)
  const [table, setTable] = useState<Record<string, CellEntry>>({})

  const experiment = useMemo(
    () =>
      lab.experiments.find(
        (e) => e.sampleId === sampleId && e.reagentId === reagentId,
      ),
    [lab.experiments, sampleId, reagentId],
  )

  const runExperiment = () => {
    if (!experiment) {
      setLastResultId(null)
      return
    }
    setPouring(true)
    setTimeout(() => {
      setPouring(false)
      setLastResultId(experiment.id)
      setTable((prev) => ({
        ...prev,
        [experiment.id]: prev[experiment.id] ?? {
          observation: '',
          interpretation: '',
        },
      }))
      celebrateSuccess()
      onStar?.()
    }, 900)
  }

  const updateCell = (
    id: string,
    field: keyof CellEntry,
    value: string,
  ) => {
    setTable((prev) => ({
      ...prev,
      [id]: {
        observation: prev[id]?.observation ?? '',
        interpretation: prev[id]?.interpretation ?? '',
        [field]: value,
      },
    }))
  }

  const activeResult = lab.experiments.find((e) => e.id === lastResultId)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-800 text-ink">Laboratoire de TP virtuel</h2>
        <p className="text-sm font-700 text-violet-dark">{lab.title}</p>
        <p className="mt-1 text-sm text-ink-soft">
          <span className="font-800">Problématique :</span> {lab.problem}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Paillasse */}
        <div className="rounded-2xl border-2 border-violet-soft/30 bg-gradient-to-br from-violet-light/50 to-white p-4 shadow-lg">
          <h3 className="mb-3 flex items-center gap-2 font-800 text-ink">
            <Beaker size={18} className="text-violet-soft" />
            Paillasse interactive
          </h3>

          <p className="mb-2 text-xs font-800 uppercase text-ink-soft">Échantillons</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {lab.samples.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSampleId(s.id)}
                className={`min-h-11 rounded-2xl px-3 py-2 text-left text-sm font-700 shadow-sm ${
                  sampleId === s.id
                    ? 'bg-violet-soft text-white'
                    : 'bg-white hover:bg-violet-light'
                }`}
              >
                {s.emoji} {s.name}
              </button>
            ))}
          </div>

          <p className="mb-2 text-xs font-800 uppercase text-ink-soft">Réactifs</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {lab.reagents.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setReagentId(r.id)}
                className={`rounded-2xl px-3 py-2 text-left text-sm font-700 shadow-sm ${
                  reagentId === r.id
                    ? 'bg-sky text-white'
                    : 'bg-white hover:bg-sky-light'
                }`}
              >
                <Pipette size={14} className="mb-0.5 inline" /> {r.name}
                <span className="mt-0.5 block text-[11px] font-600 opacity-80">
                  {r.testsFor}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={runExperiment}
            className="w-full rounded-2xl bg-mint px-4 py-3 text-sm font-800 text-white shadow-lg hover:bg-mint-dark"
          >
            Verser le réactif / Lancer le test
          </button>

          {/* Tube visualization */}
          <div className="relative mt-6 flex h-48 items-end justify-center">
            <div className="relative h-40 w-16 overflow-hidden rounded-b-3xl rounded-t-lg border-4 border-slate-300 bg-white/60">
              <motion.div
                className="absolute bottom-0 left-0 right-0"
                animate={{
                  height: activeResult ? '70%' : pouring ? '40%' : '15%',
                  backgroundColor: activeResult?.resultColor ?? '#E0F2FE',
                }}
                transition={{ type: 'spring', stiffness: 120 }}
              />
              <AnimatePresence>
                {pouring && (
                  <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 20, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-1/2 top-0 h-16 w-2 -translate-x-1/2 rounded-full bg-sky"
                  />
                )}
              </AnimatePresence>
            </div>
            <motion.div
              animate={pouring ? { rotate: 35, y: -10 } : { rotate: 0, y: 0 }}
              className="absolute right-1/3 top-2 text-4xl"
            >
              🧪
            </motion.div>
          </div>

          {activeResult ? (
            <p className="mt-3 rounded-xl bg-mint-light px-3 py-2 text-sm font-700 text-mint-dark">
              {activeResult.visualHint}
            </p>
          ) : (
            <p className="mt-3 text-center text-sm text-ink-soft">
              {experiment
                ? 'Prêt pour ce test — clique pour observer le résultat.'
                : 'Cette combinaison ne produit pas de réaction spectaculaire. Essaie une autre !'}
            </p>
          )}
        </div>

        {/* Tableau élève */}
        <div className="rounded-2xl border-2 border-mint/20 bg-white p-4 shadow-lg">
          <h3 className="mb-3 flex items-center gap-2 font-800 text-ink">
            <ClipboardCheck size={18} className="text-mint" />
            Tableau de saisie
          </h3>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {lab.experiments.map((exp) => {
              const sample = lab.samples.find((s) => s.id === exp.sampleId)
              const reagent = lab.reagents.find((r) => r.id === exp.reagentId)
              const entry = table[exp.id]
              const unlocked = Boolean(entry) || lastResultId === exp.id
              return (
                <div
                  key={exp.id}
                  className={`rounded-xl border p-3 ${
                    unlocked ? 'border-mint/40 bg-mint-light/30' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <p className="text-sm font-800">
                    {sample?.emoji} {sample?.name} + {reagent?.name}
                  </p>
                  {unlocked ? (
                    <div className="mt-2 space-y-2">
                      <label className="block text-xs font-700 text-ink-soft">
                        Observation
                        <input
                          value={entry?.observation ?? ''}
                          onChange={(e) =>
                            updateCell(exp.id, 'observation', e.target.value)
                          }
                          placeholder="Ex. Devient bleu foncé"
                          className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-600"
                        />
                      </label>
                      <label className="block text-xs font-700 text-ink-soft">
                        Interprétation
                        <input
                          value={entry?.interpretation ?? ''}
                          onChange={(e) =>
                            updateCell(exp.id, 'interpretation', e.target.value)
                          }
                          placeholder="Ex. Présence d'amidon"
                          className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-600"
                        />
                      </label>
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-ink-soft">
                      Réalise d&apos;abord ce test sur la paillasse.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowCorrection((v) => !v)}
        className="inline-flex items-center gap-2 rounded-2xl bg-tangerine px-5 py-3 text-sm font-800 text-white shadow-lg hover:bg-tangerine-dark"
      >
        <CheckCircle2 size={18} />
        {showCorrection ? 'Masquer la correction' : 'Afficher la Correction Détaillée'}
      </button>

      <AnimatePresence>
        {showCorrection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border-2 border-tangerine/30 bg-tangerine-light/40 p-5 shadow-lg">
              <h3 className="text-lg font-800 text-tangerine-dark">
                Fiche correction — barème professeur SVT
              </h3>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-tangerine/30 text-xs uppercase text-ink-soft">
                      <th className="p-2">Aliment</th>
                      <th className="p-2">Réactif</th>
                      <th className="p-2">Avant → Après</th>
                      <th className="p-2">Observation</th>
                      <th className="p-2">Interprétation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lab.experiments.map((exp) => {
                      const sample = lab.samples.find((s) => s.id === exp.sampleId)
                      const reagent = lab.reagents.find((r) => r.id === exp.reagentId)
                      return (
                        <tr key={exp.id} className="border-b border-white/60">
                          <td className="p-2 font-700">
                            {sample?.emoji} {sample?.name}
                          </td>
                          <td className="p-2">{reagent?.name}</td>
                          <td className="p-2">
                            <span className="mr-1 inline-block h-4 w-4 rounded-full bg-slate-200" />
                            →
                            <span
                              className="ml-1 inline-block h-4 w-4 rounded-full border border-slate-300"
                              style={{ backgroundColor: exp.resultColor }}
                            />
                          </td>
                          <td className="p-2">{exp.observation}</td>
                          <td className="p-2 font-700 text-mint-dark">
                            {exp.interpretation}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 rounded-xl bg-white p-4">
                <p className="text-xs font-800 uppercase text-ink-soft">
                  Conclusion attendue
                </p>
                <p className="mt-1 text-sm font-600 leading-relaxed text-ink">
                  {lab.conclusion}
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {lab.competences.map((c) => (
                  <div key={c.code} className="rounded-xl bg-white p-4">
                    <p className="text-xs font-800 text-violet-soft">
                      {c.code} — {c.title}
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
