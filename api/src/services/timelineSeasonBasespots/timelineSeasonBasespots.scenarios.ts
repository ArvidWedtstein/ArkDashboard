import type { Prisma, TimelineSeasonBasespot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TimelineSeasonBasespotCreateArgs>(
  {
    timelineSeasonBasespot: {
      one: { data: { TimelineSeason: { create: {} } } },
      two: { data: { TimelineSeason: { create: {} } } },
    },
  }
)

export type StandardScenario = ScenarioData<
  TimelineSeasonBasespot,
  'timelineSeasonBasespot'
>
