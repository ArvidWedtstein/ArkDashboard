import type { LootcrateSet } from '@prisma/client'

import {
  lootcrateSets,
  lootcrateSet,
  createLootcrateSet,
  updateLootcrateSet,
  deleteLootcrateSet,
} from './lootcrateSets'
import type { StandardScenario } from './lootcrateSets.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('lootcrateSets', () => {
  scenario('returns all lootcrateSets', async (scenario: StandardScenario) => {
    const result = await lootcrateSets()

    expect(result.length).toEqual(Object.keys(scenario.lootcrateSet).length)
  })

  scenario(
    'returns a single lootcrateSet',
    async (scenario: StandardScenario) => {
      const result = await lootcrateSet({ id: scenario.lootcrateSet.one.id })

      expect(result).toEqual(scenario.lootcrateSet.one)
    }
  )

  scenario('creates a lootcrateSet', async (scenario: StandardScenario) => {
    const result = await createLootcrateSet({
      input: { lootcrate_id: scenario.lootcrateSet.two.lootcrate_id },
    })

    expect(result.lootcrate_id).toEqual(scenario.lootcrateSet.two.lootcrate_id)
  })

  scenario('updates a lootcrateSet', async (scenario: StandardScenario) => {
    const original = (await lootcrateSet({
      id: scenario.lootcrateSet.one.id,
    })) as LootcrateSet
    const result = await updateLootcrateSet({
      id: original.id,
      input: { lootcrate_id: scenario.lootcrateSet.two.lootcrate_id },
    })

    expect(result.lootcrate_id).toEqual(scenario.lootcrateSet.two.lootcrate_id)
  })

  scenario('deletes a lootcrateSet', async (scenario: StandardScenario) => {
    const original = (await deleteLootcrateSet({
      id: scenario.lootcrateSet.one.id,
    })) as LootcrateSet
    const result = await lootcrateSet({ id: original.id })

    expect(result).toEqual(null)
  })
})
