import type { Prisma, Dino } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.DinoCreateArgs>({
  dino: {
    one: {
      data: {
        name: 'String',
        synonyms: 'String',
        can_destroy: 'String',
        immobilized_by: 'String',
        fits_through: 'String',
        eats: 'String',
        drops: 'String',
        method: 'String',
        knockout: 'String',
      },
    },
    two: {
      data: {
        name: 'String',
        synonyms: 'String',
        can_destroy: 'String',
        immobilized_by: 'String',
        fits_through: 'String',
        eats: 'String',
        drops: 'String',
        method: 'String',
        knockout: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Dino, 'dino'>
