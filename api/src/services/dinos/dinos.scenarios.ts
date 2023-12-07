import type { Prisma, Dino } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.DinoCreateArgs>({
  dino: {
    one: {
      data: {
        name: 'String',
        can_destroy: 'String',
        type: 'String',
        carryable_by: 'String',
        variants: 'String',
      },
    },
    two: {
      data: {
        name: 'String',
        can_destroy: 'String',
        type: 'String',
        carryable_by: 'String',
        variants: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Dino, 'dino'>
