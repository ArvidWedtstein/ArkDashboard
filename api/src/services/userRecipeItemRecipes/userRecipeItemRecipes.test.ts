import type { UserRecipeItemRecipe } from '@prisma/client'

import {
  userRecipeItemRecipes,
  userRecipeItemRecipe,
  createUserRecipeItemRecipe,
  updateUserRecipeItemRecipe,
  deleteUserRecipeItemRecipe,
} from './userRecipeItemRecipes'
import type { StandardScenario } from './userRecipeItemRecipes.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('userRecipeItemRecipes', () => {
  scenario(
    'returns all userRecipeItemRecipes',
    async (scenario: StandardScenario) => {
      const result = await userRecipeItemRecipes()

      expect(result.length).toEqual(
        Object.keys(scenario.userRecipeItemRecipe).length
      )
    }
  )

  scenario(
    'returns a single userRecipeItemRecipe',
    async (scenario: StandardScenario) => {
      const result = await userRecipeItemRecipe({
        id: scenario.userRecipeItemRecipe.one.id,
      })

      expect(result).toEqual(scenario.userRecipeItemRecipe.one)
    }
  )

  scenario(
    'creates a userRecipeItemRecipe',
    async (scenario: StandardScenario) => {
      const result = await createUserRecipeItemRecipe({
        input: {
          user_recipe_id: scenario.userRecipeItemRecipe.two.user_recipe_id,
          item_recipe_id: scenario.userRecipeItemRecipe.two.item_recipe_id,
        },
      })

      expect(result.user_recipe_id).toEqual(
        scenario.userRecipeItemRecipe.two.user_recipe_id
      )
      expect(result.item_recipe_id).toEqual(
        scenario.userRecipeItemRecipe.two.item_recipe_id
      )
    }
  )

  scenario(
    'updates a userRecipeItemRecipe',
    async (scenario: StandardScenario) => {
      const original = (await userRecipeItemRecipe({
        id: scenario.userRecipeItemRecipe.one.id,
      })) as UserRecipeItemRecipe
      const result = await updateUserRecipeItemRecipe({
        id: original.id,
        input: {
          item_recipe_id: scenario.userRecipeItemRecipe.two.user_recipe_id,
        },
      })

      expect(result.item_recipe_id).toEqual(
        scenario.userRecipeItemRecipe.two.user_recipe_id
      )
    }
  )

  scenario(
    'deletes a userRecipeItemRecipe',
    async (scenario: StandardScenario) => {
      const original = (await deleteUserRecipeItemRecipe({
        id: scenario.userRecipeItemRecipe.one.id,
      })) as UserRecipeItemRecipe
      const result = await userRecipeItemRecipe({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
