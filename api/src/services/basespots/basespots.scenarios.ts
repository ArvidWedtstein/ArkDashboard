import type { Prisma, Basespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BasespotCreateArgs>({
  basespot: {
    one: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 1290181.9325282916,
        longitude: 3823045.0694592767,
        Map_Basespot_MapToMap: { create: {} },
      },
    },
    two: {
      data: {
        name: 'String',
        description: 'String',
        latitude: 7868996.419053758,
        longitude: 3625130.4913216108,
        Map_Basespot_MapToMap: { create: {} },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Basespot, 'basespot'>
