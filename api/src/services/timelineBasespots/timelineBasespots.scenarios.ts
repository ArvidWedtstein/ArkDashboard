import type { Prisma, TimelineBasespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TimelineBasespotCreateArgs>({
  timelineBasespot: {
    one: { data: { tribe_name: 'String' } },
    two: { data: { tribe_name: 'String' } },
  },
})

export type StandardScenario = ScenarioData<
  TimelineBasespot,
  'timelineBasespot'
>
