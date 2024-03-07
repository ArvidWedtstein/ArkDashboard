import type { Prisma, TimelineSeasonPerson } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TimelineSeasonPersonCreateArgs>({
  timelineSeasonPerson: {
    one: { data: { TimelineSeason: { create: {} } } },
    two: { data: { TimelineSeason: { create: {} } } },
  },
})

export type StandardScenario = ScenarioData<
  TimelineSeasonPerson,
  'timelineSeasonPerson'
>
