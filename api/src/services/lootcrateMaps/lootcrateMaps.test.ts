import type { LootcrateMap } from '@prisma/client'

import {
  lootcrateMaps,
  lootcrateMap,
  createLootcrateMap,
  updateLootcrateMap,
  deleteLootcrateMap,
} from './lootcrateMaps'
import type { StandardScenario } from './lootcrateMaps.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('lootcrateMaps', () => {
  scenario('returns all lootcrateMaps', async (scenario: StandardScenario) => {
    const result = await lootcrateMaps()

    expect(result.length).toEqual(Object.keys(scenario.lootcrateMap).length)
  })

  scenario(
    'returns a single lootcrateMap',
    async (scenario: StandardScenario) => {
      const result = await lootcrateMap({ id: scenario.lootcrateMap.one.id })

      expect(result).toEqual(scenario.lootcrateMap.one)
    }
  )

  scenario('creates a lootcrateMap', async (scenario: StandardScenario) => {
    const result = await createLootcrateMap({
      input: {
        lootcrate_id: scenario.lootcrateMap.two.lootcrate_id,
        map_id: scenario.lootcrateMap.two.map_id,
      },
    })

    expect(result.lootcrate_id).toEqual(scenario.lootcrateMap.two.lootcrate_id)
    expect(result.map_id).toEqual(scenario.lootcrateMap.two.map_id)
  })

  scenario('updates a lootcrateMap', async (scenario: StandardScenario) => {
    const original = (await lootcrateMap({
      id: scenario.lootcrateMap.one.id,
    })) as LootcrateMap
    const result = await updateLootcrateMap({
      id: original.id,
      input: { lootcrate_id: scenario.lootcrateMap.two.lootcrate_id },
    })

    expect(result.lootcrate_id).toEqual(scenario.lootcrateMap.two.lootcrate_id)
  })

  scenario('deletes a lootcrateMap', async (scenario: StandardScenario) => {
    const original = (await deleteLootcrateMap({
      id: scenario.lootcrateMap.one.id,
    })) as LootcrateMap
    const result = await lootcrateMap({ id: original.id })

    expect(result).toEqual(null)
  })
})
