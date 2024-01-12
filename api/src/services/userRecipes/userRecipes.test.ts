import type { UserRecipe } from '@prisma/client'

import {
  userRecipes,
  userRecipe,
  createUserRecipe,
  updateUserRecipe,
  deleteUserRecipe,
} from './userRecipes'
import type { StandardScenario } from './userRecipes.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('userRecipes', () => {
  scenario('returns all userRecipes', async (scenario: StandardScenario) => {
    const result = await userRecipes()

    expect(result.length).toEqual(Object.keys(scenario.userRecipe).length)
  })

  scenario(
    'returns a single userRecipe',
    async (scenario: StandardScenario) => {
      const result = await userRecipe({ id: scenario.userRecipe.one.id })

      expect(result).toEqual(scenario.userRecipe.one)
    }
  )

  scenario('deletes a userRecipe', async (scenario: StandardScenario) => {
    const original = (await deleteUserRecipe({
      id: scenario.userRecipe.one.id,
    })) as UserRecipe
    const result = await userRecipe({ id: original.id })

    expect(result).toEqual(null)
  })
})
