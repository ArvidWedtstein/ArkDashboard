import type { Prisma, TimelineSeason } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TimelineSeasonCreateArgs>({
  timelineSeason: { one: { data: {} }, two: { data: {} } },
})

export type StandardScenario = ScenarioData<TimelineSeason, 'timelineSeason'>
