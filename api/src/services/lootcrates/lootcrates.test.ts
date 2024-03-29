import type { Lootcrate } from '@prisma/client'

import {
  lootcrates,
  lootcrate,
  createLootcrate,
  updateLootcrate,
  deleteLootcrate,
} from './lootcrates'
import type { StandardScenario } from './lootcrates.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('lootcrates', () => {
  scenario('returns all lootcrates', async (scenario: StandardScenario) => {
    const result = await lootcrates()

    expect(result.length).toEqual(Object.keys(scenario.lootcrate).length)
  })

  scenario('returns a single lootcrate', async (scenario: StandardScenario) => {
    const result = await lootcrate({ id: scenario.lootcrate.one.id })

    expect(result).toEqual(scenario.lootcrate.one)
  })

  scenario('creates a lootcrate', async () => {
    const result = await createLootcrate({
      input: { name: 'String' },
    })

    expect(result.name).toEqual('String')
  })

  scenario('updates a lootcrate', async (scenario: StandardScenario) => {
    const original = (await lootcrate({
      id: scenario.lootcrate.one.id,
    })) as Lootcrate
    const result = await updateLootcrate({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a lootcrate', async (scenario: StandardScenario) => {
    const original = (await deleteLootcrate({
      id: scenario.lootcrate.one.id,
    })) as Lootcrate
    const result = await lootcrate({ id: original.id })

    expect(result).toEqual(null)
  })
})
