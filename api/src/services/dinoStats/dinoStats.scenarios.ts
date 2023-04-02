import type { Prisma, DinoStat } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.DinoStatCreateArgs>({
  dinoStat: {
    one: {
      data: {
        Dino: {
          create: {
            name: 'String',
            synonyms: 'String',
            can_destroy: 'String',
            immobilized_by: 'String',
            fits_through: 'String',
            eats: 'String',
            drops: 'String',
            method: 'String',
            knockout: 'String',
            type: 'String',
            carryable_by: 'String',
          },
        },
        Item: {
          create: { name: 'String', crafted_in: 'String', effects: 'String' },
        },
      },
    },
    two: {
      data: {
        Dino: {
          create: {
            name: 'String',
            synonyms: 'String',
            can_destroy: 'String',
            immobilized_by: 'String',
            fits_through: 'String',
            eats: 'String',
            drops: 'String',
            method: 'String',
            knockout: 'String',
            type: 'String',
            carryable_by: 'String',
          },
        },
        Item: {
          create: { name: 'String', crafted_in: 'String', effects: 'String' },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<DinoStat, 'dinoStat'>
