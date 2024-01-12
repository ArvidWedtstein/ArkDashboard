import type { Prisma, UserRecipe } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserRecipeCreateArgs>({
  userRecipe: { one: { data: {} }, two: { data: {} } },
})

export type StandardScenario = ScenarioData<UserRecipe, 'userRecipe'>
