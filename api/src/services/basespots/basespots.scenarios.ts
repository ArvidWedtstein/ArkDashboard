import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        latitude: 5776419.205973442,
        longitude: 5810782.509828494,
        Map: { create: { name: 'String8698304' } },
      },
    },
    two: {
      data: {
        latitude: 8564809.661801144,
        longitude: 2480560.9607593506,
        Map: { create: { name: 'String971685' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
