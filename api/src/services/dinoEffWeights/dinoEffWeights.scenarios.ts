import type { Prisma, DinoEffWeight } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.DinoEffWeightCreateArgs>({
  dinoEffWeight: {
    one: {
      data: {
        value: 4192434.6890772157,
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
        value: 1349509.8779279168,
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

export type StandardScenario = ScenarioData<DinoEffWeight, 'dinoEffWeight'>
