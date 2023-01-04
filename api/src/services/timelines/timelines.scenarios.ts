import type { Prisma, timeline } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.timelineCreateArgs>({
  timeline: { one: { data: {} }, two: { data: {} } },
})

export type StandardScenario = ScenarioData<timeline, 'timeline'>
