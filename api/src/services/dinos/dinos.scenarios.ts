import type { Prisma, Dino } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.DinoCreateArgs>({
  dino: {
    one: {
      data: {
        name: 'String',
        can_destroy: 'String',
        fits_through: 'String',
        eats: 'String',
        drops: 'String',
        type: 'String',
        carryable_by: 'String',
      },
    },
    two: {
      data: {
        name: 'String',
        can_destroy: 'String',
        fits_through: 'String',
        eats: 'String',
        drops: 'String',
        type: 'String',
        carryable_by: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Dino, 'dino'>
