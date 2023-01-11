import type { Prisma, Timeline } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TimelineCreateArgs>({
  timeline: { one: { data: {} }, two: { data: {} } },
})

export type StandardScenario = ScenarioData<Timeline, 'timeline'>
