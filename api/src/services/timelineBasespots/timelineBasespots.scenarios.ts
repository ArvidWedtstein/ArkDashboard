import type { Prisma, TimelineBasespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TimelineBasespotCreateArgs>({
  timelineBasespot: {
    one: {
      data: {
        tribeName: 'String',
        players: 'String',
        timeline: { create: {} },
      },
    },
    two: {
      data: {
        tribeName: 'String',
        players: 'String',
        timeline: { create: {} },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  TimelineBasespot,
  'timelineBasespot'
>
