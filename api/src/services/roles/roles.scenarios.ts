import type { Prisma, role } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.roleCreateArgs>({
  role: {
    one: { data: { name: 'String', permissions: 'basespot:delete' } },
    two: { data: { name: 'String', permissions: 'basespot:delete' } },
  },
})

export type StandardScenario = ScenarioData<role, 'role'>
