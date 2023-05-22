import type { ItemRec } from '@prisma/client'

import {
  itemRecs,
  itemRec,
  createItemRec,
  updateItemRec,
  deleteItemRec,
} from './itemRecs'
import type { StandardScenario } from './itemRecs.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('itemRecs', () => {
  scenario('returns all itemRecs', async (scenario: StandardScenario) => {
    const result = await itemRecs()

    expect(result.length).toEqual(Object.keys(scenario.itemRec).length)
  })

  scenario('returns a single itemRec', async (scenario: StandardScenario) => {
    const result = await itemRec({ id: scenario.itemRec.one.id })

    expect(result).toEqual(scenario.itemRec.one)
  })

  scenario('creates a itemRec', async (scenario: StandardScenario) => {
    const result = await createItemRec({
      input: { crafted_item_id: scenario.itemRec.two.crafted_item_id },
    })

    expect(result.crafted_item_id).toEqual(scenario.itemRec.two.crafted_item_id)
  })

  scenario('updates a itemRec', async (scenario: StandardScenario) => {
    const original = (await itemRec({ id: scenario.itemRec.one.id })) as ItemRec
    const result = await updateItemRec({
      id: original.id,
      input: { crafted_item_id: scenario.itemRec.two.crafted_item_id },
    })

    expect(result.crafted_item_id).toEqual(scenario.itemRec.two.crafted_item_id)
  })

  scenario('deletes a itemRec', async (scenario: StandardScenario) => {
    const original = (await deleteItemRec({
      id: scenario.itemRec.one.id,
    })) as ItemRec
    const result = await itemRec({ id: original.id })

    expect(result).toEqual(null)
  })
})
