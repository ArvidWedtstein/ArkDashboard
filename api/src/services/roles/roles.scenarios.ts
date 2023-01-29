import type { Prisma, Role } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.RoleCreateArgs>({
  role: {
    one: { data: { name: 'String', permissions: 'basespot:delete' } },
    two: { data: { name: 'String', permissions: 'basespot:delete' } },
  },
})

export type StandardScenario = ScenarioData<Role, 'role'>
