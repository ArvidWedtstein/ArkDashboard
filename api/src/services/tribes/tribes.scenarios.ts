import type { Prisma, Tribe } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TribeCreateArgs>({
  tribe: {
    one: { data: { name: 'String5860620' } },
    two: { data: { name: 'String6060463' } },
  },
})

export type StandardScenario = ScenarioData<Tribe, 'tribe'>
