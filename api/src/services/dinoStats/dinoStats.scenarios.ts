import type { Prisma, DinoStat } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.DinoStatCreateArgs>({
  dinoStat: {
    one: {
      data: {
        type: 'food',
        Dino: {
          create: {
            name: 'String',
            can_destroy: 'String',
            type: 'String',
            carryable_by: 'String',
          },
        },
        Item: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        type: 'food',
        Dino: {
          create: {
            name: 'String',
            can_destroy: 'String',
            type: 'String',
            carryable_by: 'String',
          },
        },
        Item: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<DinoStat, 'dinoStat'>
